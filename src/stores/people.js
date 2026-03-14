import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const usePeopleStore = defineStore('btPeople', () => {
  const currentPerson = ref({})
  const me = ref({})

  const hasCurrentPerson = computed(() => Object.keys(currentPerson.value).length > 0)
  const hasMe = computed(() => Object.keys(me.value).length > 0)
  const currentPersonChanged = computed(
    () => JSON.stringify(currentPerson.value) !== JSON.stringify(me.value),
  )

  async function getMe() {
    const response = await axios.get(
      `${import.meta.env.VITE_BETTER_TOGETHER_API_URI}/api/v1/people/me`,
    )
    const person = response.status === 200 ? response.data : {}
    currentPerson.value = { ...person }
    me.value = { ...person }
    return response
  }

  async function postPerson(params) {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BETTER_TOGETHER_API_URI}/api/v1/people/me`,
      params,
    )
    currentPerson.value = data
    return data
  }

  function clearCurrentPerson() {
    currentPerson.value = {}
  }

  return {
    currentPerson,
    me,
    hasCurrentPerson,
    hasMe,
    currentPersonChanged,
    getMe,
    postPerson,
    clearCurrentPerson,
  }
}, { persist: true })
