import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSyncStatus } from '@/composables/useSyncStatus'

describe('useSyncStatus', () => {
  it('returns synced for null item', () => {
    const { syncStatus } = useSyncStatus(ref(null))
    expect(syncStatus.value).toBe('synced')
  })

  it('reads _sync_status from item', () => {
    const item = ref({ _sync_status: 'local', id: '1' })
    const { isLocal, label } = useSyncStatus(item)
    expect(isLocal.value).toBe(true)
    expect(label.value).toContain('locally')
  })

  it('reflects syncing status', () => {
    const item = ref({ _sync_status: 'syncing', id: '1' })
    const { isSyncing } = useSyncStatus(item)
    expect(isSyncing.value).toBe(true)
  })
})
