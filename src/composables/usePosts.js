import { useResource } from './useResource'

export function usePosts(communityId = null) {
  const resource = useResource('posts', communityId ? { community_id: communityId } : {})

  async function listPublished(extraFilters = {}) {
    return resource.list({ ...extraFilters })
  }

  return { ...resource, listPublished }
}
