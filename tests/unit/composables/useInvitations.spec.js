import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInvitations } from '@/composables/useInvitations'

vi.mock('@/db/client', () => ({
  getDb: vi.fn().mockResolvedValue({
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn(),
  }),
}))
vi.mock('@/stores/sync', () => ({
  useSyncStore: vi.fn(() => ({ setPendingCount: vi.fn() })),
}))

describe('useInvitations', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('initialises with empty items', () => {
    const { items } = useInvitations('community-1')
    expect(items.value).toEqual([])
  })
  it('exposes pending and accepted computed filters', () => {
    const { pending, accepted } = useInvitations()
    expect(pending.value).toEqual([])
    expect(accepted.value).toEqual([])
  })
})
