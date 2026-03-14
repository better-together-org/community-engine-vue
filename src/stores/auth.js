import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import BtApiAuth from '../endpoints/BtApiAuth'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000  // 24h — JWT access token default lifetime

export const useAuthStore = defineStore('btAuth', () => {
  const currentUser = ref({})
  const token = ref('')
  const status = ref('')
  const refreshToken = ref(null)
  const tokenIssuedAt = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const authStatus = computed(() => status.value)
  const authToken = computed(() => token.value)
  const tokenIsExpired = computed(() =>
    !!(tokenIssuedAt.value &&
    Date.now() - new Date(tokenIssuedAt.value).getTime() > TOKEN_TTL_MS)
  )
  const canSync = computed(() => !!token.value && !tokenIsExpired.value)
  // Local DB is always readable regardless of auth state
  const hasLocalAccess = computed(() => true)

  function _setAxiosAuth(t) {
    if (t) axios.defaults.headers.common.Authorization = t
    else delete axios.defaults.headers.common.Authorization
  }

  async function signIn(params) {
    status.value = 'loading'
    try {
      const { data, headers } = await BtApiAuth.post('sign-in', params)
      token.value = headers.authorization
      currentUser.value = data
      status.value = 'success'
      tokenIssuedAt.value = new Date().toISOString()
      if (headers['x-refresh-token']) refreshToken.value = headers['x-refresh-token']
      else if (data.refresh_token) refreshToken.value = data.refresh_token
      _setAxiosAuth(token.value)
      return data
    } catch (err) {
      status.value = 'error'
      currentUser.value = {}
      token.value = ''
      _setAxiosAuth(null)
      throw err
    }
  }

  async function signOut() {
    try {
      const { data } = await BtApiAuth.delete('sign-out')
      return data
    } catch (err) {
      status.value = 'error'
      throw err
    } finally {
      status.value = ''
      currentUser.value = {}
      token.value = ''
      refreshToken.value = null
      tokenIssuedAt.value = null
      _setAxiosAuth(null)
    }
  }

  // Receptacle for JWT refresh — CE Rails refresh endpoint pending (Deck #955).
  // When implemented: POST /bt/api/auth/refresh with refreshToken,
  // then set token + tokenIssuedAt on success, or dispatch 'auth:needs-reauth' on failure.
  async function refreshTokenIfNeeded() {
    if (canSync.value) return
    if (!refreshToken.value) return
    // eslint-disable-next-line no-console
    console.warn('[btAuth] refreshTokenIfNeeded: refresh endpoint not yet implemented')
  }

  async function signUp(params) {
    const { data } = await BtApiAuth.post('sign-up', {
      ...params,
      confirmation_url: `${window.location.origin}/users/confirmation`,
    })
    return data
  }

  async function resendConfirmation(params) {
    const { data } = await BtApiAuth.post('confirmation', {
      ...params,
      confirmation_url: `${window.location.origin}/users/confirmation`,
    })
    return data
  }

  async function sendConfirmation(params) {
    const { data } = await BtApiAuth.get('confirmation', { params })
    return data
  }

  async function resetPassword(params) {
    const { data } = await BtApiAuth.post('password', {
      ...params,
      new_password_url: `${window.location.origin}/users/password/new`,
    })
    return data
  }

  async function newPassword(params) {
    const { data } = await BtApiAuth.put('password', params)
    return data
  }

  return {
    currentUser,
    token,
    status,
    refreshToken,
    tokenIssuedAt,
    isAuthenticated,
    authStatus,
    authToken,
    tokenIsExpired,
    canSync,
    hasLocalAccess,
    signIn,
    signOut,
    signUp,
    resendConfirmation,
    sendConfirmation,
    resetPassword,
    newPassword,
    refreshTokenIfNeeded,
  }
}, { persist: true })
