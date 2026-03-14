import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RoleBadge from '../../../src/components/role/RoleBadge.vue'

vi.mock('bootstrap-vue-next', () => ({
  BBadge: {
    template: '<span class="b-badge" :data-variant="variant"><slot/></span>',
    props: ['variant'],
  },
}))

describe('RoleBadge', () => {
  it('renders the role name', () => {
    const wrapper = mount(RoleBadge, {
      props: { role: { slug: 'admin', name: 'Admin' } },
    })
    expect(wrapper.text()).toContain('Admin')
  })

  it('uses danger variant for admin slug', () => {
    const wrapper = mount(RoleBadge, {
      props: { role: { slug: 'admin', name: 'Admin' } },
    })
    expect(wrapper.find('.b-badge').attributes('data-variant')).toBe('danger')
  })

  it('uses warning variant for moderator slug', () => {
    const wrapper = mount(RoleBadge, {
      props: { role: { slug: 'moderator', name: 'Moderator' } },
    })
    expect(wrapper.find('.b-badge').attributes('data-variant')).toBe('warning')
  })

  it('uses secondary variant for unknown slug', () => {
    const wrapper = mount(RoleBadge, {
      props: { role: { slug: 'member', name: 'Member' } },
    })
    expect(wrapper.find('.b-badge').attributes('data-variant')).toBe('secondary')
  })
})
