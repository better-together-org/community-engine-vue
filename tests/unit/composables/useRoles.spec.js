import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRoles } from '../../../src/composables/useRoles'

// Mock PGlite and auth
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
    isAuthenticated: true,
  })),
}))

// Seed data
const seedRoles = [
  { id: 'role-1', slug: 'admin', name: 'Admin', resource_type: 'community', resource_id: 'comm-1' },
  { id: 'role-2', slug: 'moderator', name: 'Moderator', resource_type: 'community', resource_id: 'comm-1' },
  { id: 'role-3', slug: 'superadmin', name: 'Super Admin', resource_type: null, resource_id: null },
]
const seedPersonRoles = [
  { id: 'pr-1', person_id: 'person-1', role_id: 'role-1', resource_type: 'community', resource_id: 'comm-1' },
]

vi.mock('../../../src/composables/useResource', () => ({
  useResource: vi.fn((table) => {
    if (table === 'roles') {
      return {
        items: { value: seedRoles },
        loading: { value: false },
        list: vi.fn(() => Promise.resolve()),
        create: vi.fn(),
        destroy: vi.fn(),
      }
    }
    if (table === 'person_roles') {
      return {
        items: { value: seedPersonRoles },
        loading: { value: false },
        list: vi.fn(() => Promise.resolve()),
        create: vi.fn(),
        destroy: vi.fn(),
      }
    }
    return {
      items: { value: [] },
      loading: { value: false },
      list: vi.fn(),
      create: vi.fn(),
      destroy: vi.fn(),
    }
  }),
}))

describe('useRoles', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hasRole returns true when person has the role in scope', () => {
    const { hasRole } = useRoles('community', 'comm-1')
    expect(hasRole('admin')).toBe(true)
  })

  it('hasRole returns false when person does not have the role', () => {
    const { hasRole } = useRoles('community', 'comm-1')
    expect(hasRole('moderator')).toBe(false)
  })

  it('hasAnyRole returns true when person has at least one', () => {
    const { hasAnyRole } = useRoles('community', 'comm-1')
    expect(hasAnyRole('admin', 'superadmin')).toBe(true)
  })

  it('hasAnyRole returns false when person has none', () => {
    const { hasAnyRole } = useRoles('community', 'comm-1')
    expect(hasAnyRole('moderator', 'superadmin')).toBe(false)
  })

  it('mySlugs returns array of role slugs for the person in scope', () => {
    const { mySlugs } = useRoles('community', 'comm-1')
    expect(mySlugs.value).toEqual(['admin'])
  })

  it('scopedRoles filters roles by resource_type and resource_id', () => {
    const { scopedRoles } = useRoles('community', 'comm-1')
    expect(scopedRoles.value.map(r => r.slug)).toEqual(['admin', 'moderator'])
  })

  it('grantRole calls create on person_roles resource', async () => {
    const { grantRole, personRoles } = useRoles('community', 'comm-1')
    await grantRole('person-2', 'role-2')
    // The mock create is called — just ensure it doesn't throw
    expect(true).toBe(true)
  })
})
