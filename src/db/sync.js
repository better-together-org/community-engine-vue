// Electric SQL shape sync — connects PGlite to a CE Rails Electric sidecar.
// Graceful no-op when VITE_ELECTRIC_URL is not configured.
//
// Electric HTTP API: GET /v1/shape?table=<table>&offset=<offset>
// Responses are SSE streams: each line is a JSON object { headers, value, offset }
// Special message: { headers: { control: 'up-to-date' } } means initial sync complete

const ELECTRIC_URL = import.meta.env?.VITE_ELECTRIC_URL

// Tables to sync — ordered by dependency (communities before memberships, etc.)
const SYNC_TABLES = [
  'communities',
  'people',
  'posts',
  'events',
  'conversations',
  'messages',
  'notifications',
  'navigation_areas',
  'navigation_items',
  'invitations',
  'pages',
]

const OFFSET_KEY = 'cev_sync_offsets'
const RETRY_DELAY_MS = 30000

// Active AbortControllers keyed by table name
const _controllers = {}

function loadOffsets() {
  try {
    return JSON.parse(localStorage.getItem(OFFSET_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveOffsets(offsets) {
  try {
    localStorage.setItem(OFFSET_KEY, JSON.stringify(offsets))
  } catch { /* storage full / private mode */ }
}

/**
 * Build a parameterised upsert or delete SQL for a shape message row.
 * Returns null for control messages.
 */
function buildStatement(table, headers, value) {
  const op = headers?.operation

  if (op === 'insert' || op === 'update') {
    const cols = Object.keys(value).filter(k => !['_sync_status', '_server_at'].includes(k))
    // Preserve local-first: skip overwrite when row is locally modified
    const colList = cols.join(', ')
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ')
    const updates = cols.map((c, i) => `${c} = $${i + 1}`).join(', ')
    const vals = cols.map(c => value[c])

    const sql = `
      INSERT INTO ${table} (${colList}, _sync_status, _server_at)
      VALUES (${placeholders}, 'synced', strftime('%Y-%m-%dT%H:%M:%fZ','now'))
      ON CONFLICT (id) DO UPDATE SET
        ${updates},
        _sync_status = CASE WHEN ${table}._sync_status = 'local' THEN 'local' ELSE 'synced' END,
        _server_at = CASE WHEN ${table}._sync_status = 'local' THEN ${table}._server_at ELSE strftime('%Y-%m-%dT%H:%M:%fZ','now') END
    `
    return { sql, params: vals }
  }

  if (op === 'delete') {
    return {
      sql: `DELETE FROM ${table} WHERE id = $1 AND _sync_status != 'local'`,
      params: [value.id],
    }
  }

  return null
}

/**
 * Apply a batch of shape messages to PGlite.
 */
export async function applyShapeMessages(db, table, messages) {
  for (const msg of messages) {
    const { headers, value } = msg
    if (!value || !headers?.operation) continue
    const stmt = buildStatement(table, headers, value)
    if (!stmt) continue
    try {
      await db.query(stmt.sql, stmt.params)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[cev:sync] Failed to apply ${headers.operation} to ${table}:`, err)
    }
  }
}

/**
 * Start a shape subscription for a single table.
 * Streams SSE data from GET /v1/shape, parses line-by-line JSON.
 * Returns a cleanup function.
 */
function subscribeToShape(db, table, initialOffset, onUpToDate) {
  const controller = new AbortController()
  _controllers[table] = controller

  async function stream(offset) {
    const url = `${ELECTRIC_URL}/v1/shape?table=${table}&offset=${offset}`
    const response = await fetch(url, { signal: controller.signal })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for shape ${table}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    const offsets = loadOffsets()
    let currentOffset = offset
    const batch = []

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete last line

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed) continue
        let msg
        try {
          msg = JSON.parse(trimmed)
        } catch {
          continue
        }

        if (msg.offset != null) {
          currentOffset = msg.offset
        }

        if (msg.headers?.control === 'up-to-date') {
          // Flush any accumulated batch before signalling up-to-date
          if (batch.length) {
            await applyShapeMessages(db, table, batch.splice(0))
          }
          offsets[table] = currentOffset
          saveOffsets(offsets)
          onUpToDate(table)
          continue
        }

        if (msg.headers?.operation) {
          batch.push(msg)
        }
      }

      // Flush batch periodically to avoid unbounded accumulation
      if (batch.length >= 50) {
        await applyShapeMessages(db, table, batch.splice(0))
        offsets[table] = currentOffset
        saveOffsets(offsets)
      }
    }

    // Flush remaining
    if (batch.length) {
      await applyShapeMessages(db, table, batch.splice(0))
    }
    offsets[table] = currentOffset
    saveOffsets(offsets)

    // Stream ended (server closed) — reconnect with latest offset
    if (!controller.signal.aborted) {
      await stream(currentOffset)
    }
  }

  stream(initialOffset).catch(err => {
    if (controller.signal.aborted) return
    // eslint-disable-next-line no-console
    console.warn(`[cev:sync] Shape stream error for ${table}:`, err)
    throw err
  })

  return () => controller.abort()
}

let _retryTimer = null
const _cleanups = []

/**
 * Start syncing all tables.
 * No-op when VITE_ELECTRIC_URL is not set.
 * Resumes from saved localStorage offsets.
 * Retries on failure every 30s.
 */
export function startSync(db) {
  if (!ELECTRIC_URL) return

  // Lazy import to avoid Pinia init order issues
  import('../stores/sync').then(({ useSyncStore }) => {
    _doStart(db, useSyncStore)
  }).catch(() => {
    _doStart(db, null)
  })
}

function _doStart(db, useSyncStore) {
  const syncStore = useSyncStore ? useSyncStore() : null
  const offsets = loadOffsets()
  let upToDateCount = 0

  function onUpToDate(_table) {
    upToDateCount++
    if (upToDateCount >= SYNC_TABLES.length) {
      // eslint-disable-next-line no-console
      console.info('[cev:sync] Initial sync complete — all tables up to date')
    }
    if (syncStore) syncStore.setConnected(true)
  }

  function startAll() {
    for (const table of SYNC_TABLES) {
      const offset = offsets[table] ?? '-1'
      try {
        const cleanup = subscribeToShape(db, table, offset, onUpToDate)
        _cleanups.push(cleanup)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[cev:sync] Could not subscribe to ${table}:`, err)
        scheduleRetry()
        return
      }
    }
  }

  // Wrap the whole start in a promise to catch initial fetch errors
  Promise.resolve().then(startAll).catch(err => {
    // eslint-disable-next-line no-console
    console.warn('[cev:sync] Startup error:', err)
    if (syncStore) syncStore.setConnected(false)
    scheduleRetry()
  })

  function scheduleRetry() {
    if (_retryTimer) return
    _retryTimer = setTimeout(() => {
      _retryTimer = null
      // eslint-disable-next-line no-console
      console.info('[cev:sync] Retrying Electric connection…')
      _doStart(db, useSyncStore)
    }, RETRY_DELAY_MS)
  }
}

/**
 * Stop all active shape subscriptions.
 */
export function stopSync() {
  if (_retryTimer) {
    clearTimeout(_retryTimer)
    _retryTimer = null
  }
  for (const cleanup of _cleanups.splice(0)) {
    try { cleanup() } catch { /* ignore */ }
  }
  Object.keys(_controllers).forEach(k => {
    try { _controllers[k].abort() } catch { /* ignore */ }
    delete _controllers[k]
  })
}
