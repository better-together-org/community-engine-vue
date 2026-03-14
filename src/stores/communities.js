import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import BtApiV1 from '../endpoints/BtApiV1'

const PLATFORM_COMMUNITY = {
  id: 0,
  name: 'Better Together',
  description: 'A community building platform',
  customization: {
    backgroundColor: '#343a40 !important',
    coverImageUrl: '',
    coverImagePositionY: 'center',
    imageUrl: '',
  },
}

export const useCommunityStore = defineStore('btCommunities', () => {
  const communities = ref([])
  const activeCommunity = ref({ ...PLATFORM_COMMUNITY })

  const customization = computed(() => activeCommunity.value.customization)
  const coverImageUrl = computed(() => activeCommunity.value.customization.coverImageUrl)
  const coverImagePositionY = computed(() => activeCommunity.value.customization.coverImagePositionY)

  function setCoverImageUrl(url) {
    activeCommunity.value.customization.coverImageUrl = url
  }

  function setCustomizationOptions(options) {
    activeCommunity.value.customization = {
      ...PLATFORM_COMMUNITY.customization,
      ...options,
    }
  }

  async function getCommunities(params) {
    const { data } = await BtApiV1.findAll('communities', { params })
    communities.value = data
    return data
  }

  async function postCommunity(params) {
    const { data } = await BtApiV1.create('community', params)
    communities.value.unshift(data)
    return data
  }

  return {
    communities,
    activeCommunity,
    customization,
    coverImageUrl,
    coverImagePositionY,
    setCoverImageUrl,
    setCustomizationOptions,
    getCommunities,
    postCommunity,
  }
}, { persist: true })
