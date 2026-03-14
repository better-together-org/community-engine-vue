import { useResource } from './useResource'

export function usePages(communityId = null) {
  const filters = communityId ? { community_id: communityId } : {}
  return useResource('pages', filters)
}
