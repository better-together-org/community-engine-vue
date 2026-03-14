import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('useAuthStore offline auth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('hasLocalAccess is always true', () => {
    const store = useAuthStore()
    expect(store.hasLocalAccess).toBe(true)
  })

  it('canSync is false when no token', () => {
    const store = useAuthStore()
    expect(store.canSync).toBe(false)
  })

  it('tokenIsExpired is false when no tokenIssuedAt', () => {
    const store = useAuthStore()
    expect(store.tokenIsExpired).toBe(false)
  })

  it('tokenIsExpired is false for a freshly issued token', () => {
    const store = useAuthStore()
    store.token = 'valid-token'
    store.tokenIssuedAt = new Date().toISOString()
    expect(store.tokenIsExpired).toBe(false)
  })

  it('canSync is true with a valid token', () => {
    const store = useAuthStore()
    store.token = 'valid-token'
    store.tokenIssuedAt = new Date().toISOString()
    expect(store.canSync).toBe(true)
  })

  it('refreshTokenIfNeeded is a no-op when canSync is true', async () => {
    const store = useAuthStore()
    store.token = 'valid-token'
    store.tokenIssuedAt = new Date().toISOString()
    await expect(store.refreshTokenIfNeeded()).resolves.toBeUndefined()
  })

  it('refreshTokenIfNeeded is a no-op when no refreshToken available', async () => {
    const store = useAuthStore()
    // token expired but no refreshToken
    store.token = 'expired'
    store.tokenIssuedAt = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
    store.refreshToken = null
    await expect(store.refreshTokenIfNeeded()).resolves.toBeUndefined()
  })
})
