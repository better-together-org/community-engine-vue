import { computed } from 'vue'
import { useResource } from './useResource'

export function useJoaTuRequests(communityId = null) {
  const filters = communityId ? { community_id: communityId } : {}
  const resource = useResource('joa_tu_requests', filters)
  const open = computed(() => resource.items.value.filter((r) => r.status === 'open'))
  const fulfilled = computed(() => resource.items.value.filter((r) => r.status === 'fulfilled'))
  return { ...resource, open, fulfilled }
}
