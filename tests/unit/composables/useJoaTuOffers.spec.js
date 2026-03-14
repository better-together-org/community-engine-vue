import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useJoaTuOffers } from '@/composables/useJoaTuOffers'

vi.mock('@/db/client', () => ({
  getDb: vi.fn().mockResolvedValue({
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn(),
  }),
}))
vi.mock('@/stores/sync', () => ({
  useSyncStore: vi.fn(() => ({ setPendingCount: vi.fn() })),
}))

describe('useJoaTuOffers', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('initialises with empty items', () => {
    const { items } = useJoaTuOffers('community-1')
    expect(items.value).toEqual([])
  })
  it('exposes open and fulfilled computed filters', () => {
    const { open, fulfilled } = useJoaTuOffers()
    expect(open.value).toEqual([])
    expect(fulfilled.value).toEqual([])
  })
})
