import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RoleGate from '../../../src/components/role/RoleGate.vue'

// Mock useRoles to control hasRole/hasAnyRole
vi.mock('../../../src/composables/useRoles', () => ({
  useRoles: vi.fn(() => ({
    hasRole: vi.fn((slug) => slug === 'admin'),
    hasAnyRole: vi.fn((...slugs) => slugs.includes('admin')),
    roles: { value: [] },
    personRoles: { value: [] },
    scopedRoles: { value: [] },
    myAssignments: { value: [] },
    mySlugs: { value: ['admin'] },
    loading: { value: false },
    loadRoles: vi.fn(),
    grantRole: vi.fn(),
    revokeRole: vi.fn(),
  })),
}))

describe('RoleGate', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders slot when person has required role', () => {
    const wrapper = mount(RoleGate, {
      props: { role: 'admin' },
      slots: { default: '<span>admin content</span>' },
    })
    expect(wrapper.text()).toContain('admin content')
  })

  it('renders fallback when person lacks required role', () => {
    const wrapper = mount(RoleGate, {
      props: { role: 'superadmin' },
      slots: {
        default: '<span>secret</span>',
        fallback: '<span>access denied</span>',
      },
    })
    expect(wrapper.text()).toContain('access denied')
    expect(wrapper.text()).not.toContain('secret')
  })

  it('renders slot when person has any of the required roles', () => {
    const wrapper = mount(RoleGate, {
      props: { anyRole: ['admin', 'moderator'] },
      slots: { default: '<span>mod panel</span>' },
    })
    expect(wrapper.text()).toContain('mod panel')
  })

  it('renders nothing when no role or anyRole prop given', () => {
    const wrapper = mount(RoleGate, {
      slots: { default: '<span>hidden</span>' },
    })
    expect(wrapper.text()).not.toContain('hidden')
  })
})
