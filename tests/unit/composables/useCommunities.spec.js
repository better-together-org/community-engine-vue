import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/db/client', () => ({
  getDb: vi.fn().mockResolvedValue({
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn().mockResolvedValue(undefined),
  }),
  resetDb: vi.fn(),
}))

vi.mock('@/stores/sync', () => ({
  useSyncStore: vi.fn(() => ({ setPendingCount: vi.fn() })),
}))

import { setActivePinia, createPinia } from 'pinia'
import { useCommunities } from '@/composables/useCommunities'

describe('useCommunities', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('findBySlug queries by slug', async () => {
    const { getDb } = await import('@/db/client')
    const mockDb = await getDb()
    mockDb.query.mockResolvedValueOnce({ rows: [{ id: '1', slug: 'test', name: 'Test' }] })
    const { findBySlug, current } = useCommunities()
    await findBySlug('test')
    expect(mockDb.query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE slug'),
      ['test'],
    )
    expect(current.value?.slug).toBe('test')
  })
})
