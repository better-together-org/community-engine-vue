import { computed } from 'vue'
import { useResource } from './useResource'

export function useJoaTuOffers(communityId = null) {
  const filters = communityId ? { community_id: communityId } : {}
  const resource = useResource('joa_tu_offers', filters)
  const open = computed(() => resource.items.value.filter((o) => o.status === 'open'))
  const fulfilled = computed(() => resource.items.value.filter((o) => o.status === 'fulfilled'))
  return { ...resource, open, fulfilled }
}
