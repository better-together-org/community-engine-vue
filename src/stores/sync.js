import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDb } from '../db/client'

// All tables that carry _sync_status (excludes _schema_versions)
const SYNC_TABLES = [
  'people', 'communities', 'posts', 'events',
  'conversations', 'messages', 'notifications',
  'navigation_areas', 'navigation_items',
  'person_community_memberships', 'uploads',
]

export const useSyncStore = defineStore('btSync', () => {
  const online = ref(navigator.onLine)
  const pendingCount = ref(0)
  const syncing = ref(false)

  const statusLabel = computed(() => {
    if (!online.value) return 'offline'
    if (syncing.value || pendingCount.value > 0) return 'syncing'
    return 'synced'
  })

  function setOnline(val) {
    online.value = val
  }

  function setPendingCount(n) {
    pendingCount.value = n
  }

  function setSyncing(val) {
    syncing.value = val
  }

  async function markPendingAsNeedsAuth() {
    const db = await getDb()
    for (const table of SYNC_TABLES) {
      try {
        await db.exec(
          `UPDATE ${table} SET _sync_status = 'needs-auth' WHERE _sync_status = 'local'`
        )
      } catch { /* table may not exist yet */ }
    }
  }

  async function drainSyncQueue() {
    // Placeholder — full sync requires ElectricSQL shapes (pending CE Rails sidecar).
    // Counts pending items across all tables and updates pendingCount for UI feedback.
    if (!online.value) return
    setSyncing(true)
    const db = await getDb()
    let total = 0
    for (const table of SYNC_TABLES) {
      try {
        const { rows } = await db.query(
          `SELECT COUNT(*) AS n FROM ${table} WHERE _sync_status IN ('local', 'needs-auth')`
        )
        total += rows[0]?.n ?? 0
      } catch { /* table may not exist yet */ }
    }
    setPendingCount(total)
    setSyncing(false)
  }

  function initNetworkListeners() {
    window.addEventListener('online', async () => {
      online.value = true
      await drainSyncQueue()
    })
    window.addEventListener('offline', () => { online.value = false })
  }

  return {
    online,
    pendingCount,
    syncing,
    statusLabel,
    setOnline,
    setPendingCount,
    setSyncing,
    markPendingAsNeedsAuth,
    drainSyncQueue,
    initNetworkListeners,
  }
})
