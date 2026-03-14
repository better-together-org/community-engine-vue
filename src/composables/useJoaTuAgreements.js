import { computed } from 'vue'
import { useResource } from './useResource'

export function useJoaTuAgreements(communityId = null) {
  const filters = communityId ? { community_id: communityId } : {}
  const resource = useResource('joa_tu_agreements', filters)
  const pending = computed(() => resource.items.value.filter((a) => a.status === 'pending'))
  const active = computed(() => resource.items.value.filter((a) => a.status === 'active'))
  const completed = computed(() => resource.items.value.filter((a) => a.status === 'completed'))
  return { ...resource, pending, active, completed }
}
