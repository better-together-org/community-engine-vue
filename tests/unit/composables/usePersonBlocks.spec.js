import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePersonBlocks } from '../../../src/composables/usePersonBlocks'

vi.mock('../../../src/db/client', () => ({
  getDb: vi.fn(() => Promise.resolve({
    exec: vi.fn(),
    query: vi.fn(() => ({ rows: [] })),
  })),
}))

vi.mock('../../../src/stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    personId: 'person-1',
    token: 'test-token',
  })),
}))

let mockBlocks = [
  { id: 'block-1', blocker_id: 'person-1', blocked_id: 'person-2', reason: null },
]

vi.mock('../../../src/composables/useResource', () => ({
  useResource: vi.fn(() => ({
    items: { value: mockBlocks },
    loading: { value: false },
    list: vi.fn(() => Promise.resolve()),
    create: vi.fn((data) => {
      mockBlocks.push(data)
      return Promise.resolve(data)
    }),
    destroy: vi.fn((id) => {
      mockBlocks = mockBlocks.filter(b => b.id !== id)
      return Promise.resolve()
    }),
  })),
}))

describe('usePersonBlocks', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockBlocks = [
      { id: 'block-1', blocker_id: 'person-1', blocked_id: 'person-2', reason: null },
    ]
  })

  it('isBlocked returns true for a blocked person', () => {
    const { isBlocked } = usePersonBlocks()
    expect(isBlocked('person-2')).toBe(true)
  })

  it('isBlocked returns false for a non-blocked person', () => {
    const { isBlocked } = usePersonBlocks()
    expect(isBlocked('person-3')).toBe(false)
  })

  it('isBlockedBy returns true when the current person is blocked by someone', () => {
    mockBlocks = [{ id: 'block-2', blocker_id: 'person-3', blocked_id: 'person-1' }]
    const { isBlockedBy } = usePersonBlocks()
    expect(isBlockedBy('person-3')).toBe(true)
  })

  it('filterBlocked removes blocked people from a list', () => {
    const { filterBlocked } = usePersonBlocks()
    const people = [
      { id: 'person-2', name: 'Blocked Person' },
      { id: 'person-3', name: 'Normal Person' },
    ]
    const filtered = filterBlocked(people)
    expect(filtered.map(p => p.id)).toEqual(['person-3'])
  })
})
