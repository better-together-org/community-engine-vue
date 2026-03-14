import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import OfferCard from '@/components/joatu/OfferCard.vue'

vi.mock('@/components/sync/SyncBadge.vue', () => ({
  default: { template: '<span class="sync-badge-mock"/>', props: ['item', 'status'] },
}))
vi.mock('@/components/shared/ExtensionSlot.vue', () => ({
  default: { template: '<div class="extension-slot-mock"/>', props: ['target', 'slot', 'context'] },
}))
vi.mock('bootstrap-vue-next', () => ({
  BCard: { template: '<div class="b-card"><slot name="header"/><slot/><slot name="footer"/></div>' },
  BCardBody: { template: '<div><slot/></div>' },
  BCardText: { template: '<p><slot/></p>' },
  BBadge: { template: '<span><slot/></span>', props: ['variant'] },
  BButton: { template: '<button @click="$emit(\'click\')"><slot/></button>', props: ['variant', 'size'], emits: ['click'] },
}))

const mockOffer = {
  id: '1',
  title: 'Guitar lessons',
  description: 'I can teach guitar',
  time_credits: 2,
  status: 'open',
  category: 'Skills',
  _sync_status: 'local',
}

describe('OfferCard', () => {
  it('renders offer title and time credits', () => {
    const wrapper = mount(OfferCard, { props: { offer: mockOffer } })
    expect(wrapper.text()).toContain('Guitar lessons')
    expect(wrapper.text()).toContain('2')
  })
})
