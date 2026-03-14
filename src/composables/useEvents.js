import { useResource } from './useResource'

export function useEvents(communityId = null) {
  return useResource('events', communityId ? { community_id: communityId } : {})
}
