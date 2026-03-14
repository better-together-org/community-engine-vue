import { describe, it, expect, beforeEach } from 'vitest'
import { registerSlotInjection, getSlotInjections, clearSlotRegistry } from '@/slot-registry'
import { defineComponent } from 'vue'

describe('slot registry', () => {
  beforeEach(() => clearSlotRegistry())

  const MockComponent = defineComponent({ template: '<div/>' })

  it('returns empty array for unregistered slot', () => {
    expect(getSlotInjections('PostCard', 'footer')).toEqual([])
  })

  it('registers and retrieves a slot injection', () => {
    registerSlotInjection({ target: 'PostCard', slot: 'footer', component: MockComponent })
    const injections = getSlotInjections('PostCard', 'footer')
    expect(injections).toHaveLength(1)
    expect(injections[0].component).toBe(MockComponent)
  })

  it('supports multiple injections for same slot', () => {
    registerSlotInjection({ target: 'BtHeader', slot: 'nav-append', component: MockComponent })
    registerSlotInjection({ target: 'BtHeader', slot: 'nav-append', component: MockComponent })
    expect(getSlotInjections('BtHeader', 'nav-append')).toHaveLength(2)
  })

  it('does not mix up different targets', () => {
    registerSlotInjection({ target: 'PostCard', slot: 'footer', component: MockComponent })
    expect(getSlotInjections('EventCard', 'footer')).toHaveLength(0)
  })

  it('stores props alongside the component', () => {
    const injProps = { color: 'red' }
    registerSlotInjection({ target: 'PostCard', slot: 'header', component: MockComponent, props: injProps })
    expect(getSlotInjections('PostCard', 'header')[0].props).toEqual(injProps)
  })
})
