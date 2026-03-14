import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('../../../src/composables/useRoles', () => ({
  useRoles: vi.fn(() => ({
    hasRole: vi.fn((slug) => slug === 'admin'),
    hasAnyRole: vi.fn((...slugs) => slugs.includes('admin')),
    roles: ref([]),
    personRoles: ref([]),
    scopedRoles: ref([]),
    myAssignments: ref([]),
    mySlugs: ref(['admin']),
    loading: ref(false),
    loadRoles: vi.fn(),
    grantRole: vi.fn(),
    revokeRole: vi.fn(),
  })),
}))

vi.mock('../../../src/composables/useCommunities', () => ({
  useCommunities: vi.fn(() => ({
    current: ref({ id: 'c1', name: 'Test Community', slug: 'test-community', description: 'A test community' }),
    loading: ref(false),
    findBySlug: vi.fn(),
    update: vi.fn(),
    items: ref([]),
    list: vi.fn(),
    create: vi.fn(),
  })),
}))

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({ params: { communitySlug: 'test-community' } })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  RouterLink: { template: '<a class="router-link"><slot/></a>' },
}))

vi.mock('bootstrap-vue-next', () => ({
  BCard: {
    template: '<div class="b-card"><slot name="header"/><slot/></div>',
    props: ['borderVariant'],
  },
  BButton: {
    template: '<button @click="$emit(\'click\')"><slot/></button>',
    props: ['variant'],
    emits: ['click'],
  },
  BSpinner: { template: '<span class="spinner"/>', props: ['label'] },
  BAlert: { template: '<div class="b-alert"><slot/></div>', props: ['variant', 'modelValue'] },
  BModal: {
    template: '<div class="b-modal"><slot/></div>',
    props: ['modelValue', 'title', 'okVariant', 'okTitle'],
    emits: ['update:modelValue', 'ok'],
  },
}))

vi.mock('../../../src/components/role/RoleGate.vue', () => ({
  default: {
    template: '<div><slot v-if="allowed"/><slot v-else name="fallback"/></div>',
    props: ['role', 'anyRole', 'resourceType', 'resourceId'],
    computed: {
      allowed() {
        return true
      },
    },
  },
}))

vi.mock('../../../src/components/CommunityForm.vue', () => ({
  default: { template: '<form class="community-form-mock"/>', props: ['model'], emits: ['submit'] },
}))

import CommunitySettingsPage from '../../../src/pages/community/CommunitySettingsPage.vue'

describe('CommunitySettingsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders settings title for admin', () => {
    const wrapper = mount(CommunitySettingsPage)
    expect(wrapper.text()).toContain('Community Settings')
  })

  it('renders CommunityForm for editing', () => {
    const wrapper = mount(CommunitySettingsPage)
    expect(wrapper.find('.community-form-mock').exists()).toBe(true)
  })

  it('renders link to role manager', () => {
    const wrapper = mount(CommunitySettingsPage, {
      global: {
        stubs: { RouterLink: { template: '<a class="router-link"><slot/></a>' } },
      },
    })
    expect(wrapper.find('.router-link').exists()).toBe(true)
  })

  it('renders danger zone with leave button', () => {
    const wrapper = mount(CommunitySettingsPage)
    expect(wrapper.text()).toContain('Danger Zone')
    expect(wrapper.text()).toContain('Leave Community')
  })

  it('shows fallback when person is not admin', () => {
    const FallbackGate = {
      template: '<div><slot name="fallback"/></div>',
      props: ['role', 'anyRole', 'resourceType', 'resourceId'],
    }
    const wrapper = mount(CommunitySettingsPage, {
      global: { stubs: { RoleGate: FallbackGate } },
    })
    expect(wrapper.find('.b-alert').exists()).toBe(true)
    expect(wrapper.find('.community-form-mock').exists()).toBe(false)
  })
})
