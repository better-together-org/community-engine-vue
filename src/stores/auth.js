import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import BtApiAuth from '../endpoints/BtApiAuth'

export const useAuthStore = defineStore('btAuth', () => {
  const currentUser = ref({})
  const token = ref('')
  const status = ref('')

  const isAuthenticated = computed(() => !!token.value)
  const authStatus = computed(() => status.value)
  const authToken = computed(() => token.value)

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
      _setAxiosAuth(null)
    }
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
    isAuthenticated,
    authStatus,
    authToken,
    signIn,
    signOut,
    signUp,
    resendConfirmation,
    sendConfirmation,
    resetPassword,
    newPassword,
  }
}, { persist: true })
