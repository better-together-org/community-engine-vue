import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSyncStore } from '@/stores/sync'

describe('useSyncStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with navigator.onLine value', () => {
    const store = useSyncStore()
    expect(typeof store.online).toBe('boolean')
  })

  it('statusLabel is offline when not online', () => {
    const store = useSyncStore()
    store.setOnline(false)
    expect(store.statusLabel).toBe('offline')
  })

  it('statusLabel is syncing when online with pending items', () => {
    const store = useSyncStore()
    store.setOnline(true)
    store.setPendingCount(3)
    expect(store.statusLabel).toBe('syncing')
  })

  it('statusLabel is synced when online and no pending', () => {
    const store = useSyncStore()
    store.setOnline(true)
    store.setPendingCount(0)
    store.setSyncing(false)
    expect(store.statusLabel).toBe('synced')
  })
})
