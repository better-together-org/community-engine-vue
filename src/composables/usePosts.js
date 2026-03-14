import { useResource } from './useResource'
import { getDb } from '../db/client'

export function usePosts(communityId = null) {
  const resource = useResource('posts', communityId ? { community_id: communityId } : {})

  async function listPublished(_extraFilters = {}) {
    const db = await getDb()
    if (communityId) {
      const { rows } = await db.query(
        'SELECT * FROM posts WHERE published_at IS NOT NULL AND community_id = $1 ORDER BY published_at DESC',
        [communityId],
      )
      resource.items.value = rows
      return rows
    } else {
      const { rows } = await db.query(
        'SELECT * FROM posts WHERE published_at IS NOT NULL ORDER BY published_at DESC',
        [],
      )
      resource.items.value = rows
      return rows
    }
  }

  return { ...resource, listPublished }
}
