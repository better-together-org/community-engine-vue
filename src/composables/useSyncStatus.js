import { computed } from 'vue'

export function useSyncStatus(item) {
  const syncStatus = computed(() => item?.value?._sync_status ?? item?._sync_status ?? 'synced')

  const isLocal = computed(() => syncStatus.value === 'local')
  const isSyncing = computed(() => syncStatus.value === 'syncing')
  const isSynced = computed(() => syncStatus.value === 'synced')
  const isConflict = computed(() => syncStatus.value === 'conflict')

  const label = computed(() => {
    switch (syncStatus.value) {
    case 'local': return 'Saved locally — will sync when online'
    case 'syncing': return 'Syncing…'
    case 'synced': return 'Synced'
    case 'conflict': return 'Conflict — newer version on server'
    default: return ''
    }
  })

  return { syncStatus, isLocal, isSyncing, isSynced, isConflict, label }
}
