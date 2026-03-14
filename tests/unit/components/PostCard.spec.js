import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCard from '@/components/post/PostCard.vue'

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

const mockPost = {
  id: '1',
  title: 'Test Post',
  content: 'Hello world',
  privacy: 'public',
  published_at: '2026-01-01T00:00:00Z',
  community_id: 'c1',
  _sync_status: 'synced',
}

describe('PostCard', () => {
  it('renders post title', () => {
    const wrapper = mount(PostCard, { props: { post: mockPost } })
    expect(wrapper.text()).toContain('Test Post')
  })

  it('truncates long content', () => {
    const longPost = { ...mockPost, content: 'x'.repeat(300) }
    const wrapper = mount(PostCard, { props: { post: longPost } })
    expect(wrapper.text()).toContain('…')
  })

  it('renders SyncBadge', () => {
    const wrapper = mount(PostCard, { props: { post: mockPost } })
    expect(wrapper.find('.sync-badge-mock').exists()).toBe(true)
  })

  it('renders ExtensionSlot in footer', () => {
    const wrapper = mount(PostCard, { props: { post: mockPost } })
    expect(wrapper.find('.extension-slot-mock').exists()).toBe(true)
  })

  it('emits view event on button click', async () => {
    const wrapper = mount(PostCard, { props: { post: mockPost } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('view')).toBeTruthy()
    expect(wrapper.emitted('view')[0]).toEqual([mockPost])
  })
})
