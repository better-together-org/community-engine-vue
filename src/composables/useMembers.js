import { useResource } from './useResource'

export function useMembers(communityId = null) {
  return useResource('people', communityId ? { community_id: communityId } : {})
}
