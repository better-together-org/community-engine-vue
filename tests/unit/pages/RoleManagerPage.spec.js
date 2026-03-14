import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

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

vi.mock('../../../src/composables/useMembers', () => ({
  useMembers: vi.fn(() => ({
    items: {
      value: [
        { id: 'm1', person_id: 'p1', name: 'Alice', handle: 'alice' },
        { id: 'm2', person_id: 'p2', name: 'Bob', handle: 'bob' },
      ],
    },
    loading: { value: false },
    listActive: vi.fn(),
  })),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { communitySlug: 'test-community' } })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  RouterLink: { template: '<a><slot/></a>' },
}))

vi.mock('bootstrap-vue-next', () => ({
  BCard: { template: '<div class="b-card"><slot name="header"/><slot/><slot name="footer"/></div>' },
  BSpinner: { template: '<span class="spinner"/>', props: ['label'] },
  BAlert: { template: '<div class="b-alert"><slot/></div>', props: ['variant', 'modelValue'] },
  BTableSimple: { template: '<table><slot/></table>' },
  BThead: { template: '<thead><slot/></thead>' },
  BTbody: { template: '<tbody><slot/></tbody>' },
  BTr: { template: '<tr><slot/></tr>' },
  BTh: { template: '<th><slot/></th>' },
}))

vi.mock('../../../src/components/role/RoleGate.vue', () => ({
  default: {
    template: '<div><slot v-if="allowed"/><slot v-else name="fallback"/></div>',
    props: ['role', 'anyRole', 'resourceType', 'resourceId'],
    setup(props) {
      const { useRoles } = require('../../../src/composables/useRoles')
      const { hasRole, hasAnyRole } = useRoles(props.resourceType, props.resourceId)
      const allowed = props.anyRole?.length
        ? hasAnyRole(...props.anyRole)
        : props.role
          ? hasRole(props.role)
          : false
      return { allowed }
    },
  },
}))

vi.mock('../../../src/components/community/MemberRoleRow.vue', () => ({
  default: {
    template: '<tr class="member-role-row-mock"><td>{{ member.name }}</td></tr>',
    props: ['member', 'resourceType', 'resourceId'],
  },
}))

vi.mock('../../../src/components/shared/ExtensionSlot.vue', () => ({
  default: { template: '<div class="extension-slot-mock"/>', props: ['target', 'context'] },
}))

import RoleManagerPage from '../../../src/pages/community/RoleManagerPage.vue'

describe('RoleManagerPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders role manager title for admin', () => {
    const wrapper = mount(RoleManagerPage)
    expect(wrapper.text()).toContain('Role Manager')
  })

  it('renders member rows for each member', () => {
    const wrapper = mount(RoleManagerPage)
    expect(wrapper.findAll('.member-role-row-mock').length).toBe(2)
    expect(wrapper.text()).toContain('Alice')
    expect(wrapper.text()).toContain('Bob')
  })

  it('shows fallback when person is not admin', () => {
    const { useRoles } = require('../../../src/composables/useRoles')
    useRoles.mockReturnValueOnce({
      hasRole: vi.fn(() => false),
      hasAnyRole: vi.fn(() => false),
      roles: { value: [] },
      personRoles: { value: [] },
      scopedRoles: { value: [] },
      myAssignments: { value: [] },
      mySlugs: { value: [] },
      loading: { value: false },
      loadRoles: vi.fn(),
      grantRole: vi.fn(),
      revokeRole: vi.fn(),
    })
    const wrapper = mount(RoleManagerPage)
    expect(wrapper.find('.b-alert').exists()).toBe(true)
  })
})
