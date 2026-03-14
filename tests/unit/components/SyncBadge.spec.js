import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import SyncBadge from '@/components/sync/SyncBadge.vue'

describe('SyncBadge', () => {
  const pinia = createPinia()

  it('renders nothing when synced', () => {
    const wrapper = mount(SyncBadge, {
      props: { status: 'synced' },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.sync-badge').exists()).toBe(false)
  })

  it('renders amber dot when local', () => {
    const wrapper = mount(SyncBadge, {
      props: { status: 'local' },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.sync-dot--local').exists()).toBe(true)
  })

  it('renders spin when syncing', () => {
    const wrapper = mount(SyncBadge, {
      props: { status: 'syncing' },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.sync-dot--syncing').exists()).toBe(true)
  })

  it('has accessible title when local', () => {
    const wrapper = mount(SyncBadge, {
      props: { status: 'local' },
      global: { plugins: [pinia] },
    })
    expect(wrapper.find('.sync-badge').attributes('title')).toContain('locally')
  })
})
