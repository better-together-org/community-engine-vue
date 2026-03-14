import { ref, computed } from 'vue'
import { getDb } from '../db/client'
import { useSyncStore } from '../stores/sync'

function buildWhereClause(filters) {
  const conditions = Object.entries(filters)
    .filter(([, v]) => v != null)
    .map(([k]) => `${k} = ?`)
  return conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
}

function buildWhereValues(filters) {
  return Object.entries(filters)
    .filter(([, v]) => v != null)
    .map(([, v]) => v)
}

function buildInsertSql(table, row) {
  const cols = Object.keys(row)
  const placeholders = cols.map(() => '?').join(', ')
  return `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`
}

function buildUpdateSql(table, attrs) {
  const sets = Object.keys(attrs).map((k) => `${k} = ?`).join(', ')
  return `UPDATE ${table} SET ${sets} WHERE id = ?`
}

export function useResource(table, defaultFilters = {}) {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const pendingCount = computed(() => items.value.filter((i) => i._sync_status === 'local').length)

  async function list(extraFilters = {}) {
    loading.value = true
    error.value = null
    try {
      const db = await getDb()
      const filters = { ...defaultFilters, ...extraFilters }
      const where = buildWhereClause(filters)
      const vals = buildWhereValues(filters)
      const result = await db.query(
        `SELECT * FROM ${table} ${where} ORDER BY _local_updated DESC`,
        vals,
      )
      items.value = result.rows
      const sync = useSyncStore()
      sync.setPendingCount(result.rows.filter((r) => r._sync_status === 'local').length)
      return result.rows
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function get(id) {
    loading.value = true
    error.value = null
    try {
      const db = await getDb()
      const result = await db.query(`SELECT * FROM ${table} WHERE id = $1`, [id])
      current.value = result.rows[0] ?? null
      return current.value
    } catch (e) {
      error.value = e
      throw e
    } finally {
      loading.value = false
    }
  }

  async function create(attrs) {
    const db = await getDb()
    const id = attrs.id || crypto.randomUUID()
    const now = new Date().toISOString()
    const row = {
      id,
      ...attrs,
      _sync_status: 'local',
      _local_updated: now,
    }
    await db.query(buildInsertSql(table, row), Object.values(row))
    items.value.unshift(row)
    return row
  }

  async function update(id, attrs) {
    const db = await getDb()
    const now = new Date().toISOString()
    const updates = { ...attrs, _sync_status: 'local', _local_updated: now }
    await db.query(buildUpdateSql(table, updates), [...Object.values(updates), id])
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) items.value[idx] = { ...items.value[idx], ...updates }
    if (current.value?.id === id) current.value = { ...current.value, ...updates }
    return items.value[idx] ?? current.value
  }

  async function destroy(id) {
    const db = await getDb()
    await db.query(`DELETE FROM ${table} WHERE id = $1`, [id])
    items.value = items.value.filter((i) => i.id !== id)
    if (current.value?.id === id) current.value = null
  }

  async function markSynced(id, serverAt = null) {
    const db = await getDb()
    const now = serverAt || new Date().toISOString()
    await db.query(
      `UPDATE ${table} SET _sync_status = 'synced', _server_at = ? WHERE id = ?`,
      [now, id],
    )
    const idx = items.value.findIndex((i) => i.id === id)
    if (idx >= 0) items.value[idx] = { ...items.value[idx], _sync_status: 'synced', _server_at: now }
    if (current.value?.id === id) {
      current.value = { ...current.value, _sync_status: 'synced', _server_at: now }
    }
  }

  return {
    items,
    current,
    loading,
    error,
    pendingCount,
    list,
    get,
    create,
    update,
    destroy,
    markSynced,
  }
}
