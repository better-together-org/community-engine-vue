import { computed } from 'vue'
import { useResource } from './useResource'

export function useInvitations(communityId = null) {
  const filters = communityId ? { community_id: communityId } : {}
  const resource = useResource('invitations', filters)
  const pending = computed(() => resource.items.value.filter((i) => i.status === 'pending'))
  const accepted = computed(() => resource.items.value.filter((i) => i.status === 'accepted'))
  return { ...resource, pending, accepted }
}
