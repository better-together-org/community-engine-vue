import { useResource } from './useResource'

export function useConversations(communityId = null) {
  return useResource('conversations', communityId ? { community_id: communityId } : {})
}
