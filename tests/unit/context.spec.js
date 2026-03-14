import { describe, it, expect, afterEach } from 'vitest'
import { getCevContext, setCevContext } from '@/context'

describe('cev context', () => {
  afterEach(() => {
    // Reset to null after each test so tests don't bleed into each other
    setCevContext(null)
  })

  it('throws when accessed before install', () => {
    setCevContext(null)
    expect(() => getCevContext()).toThrow('not installed')
  })

  it('returns context after setCevContext', () => {
    const ctx = { app: { config: { globalProperties: {} } }, options: {} }
    setCevContext(ctx)
    expect(getCevContext().app).toBe(ctx.app)
  })

  it('exposes router via lazy getter', () => {
    const mockRouter = { push: () => {} }
    const ctx = { app: { config: { globalProperties: { $router: mockRouter } } }, options: {} }
    setCevContext(ctx)
    expect(getCevContext().router).toBe(mockRouter)
  })

  it('returns undefined router when $router not yet installed', () => {
    setCevContext({ app: { config: { globalProperties: {} } }, options: {} })
    expect(getCevContext().router).toBeUndefined()
  })
})
