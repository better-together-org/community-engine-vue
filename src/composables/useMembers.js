import { useResource } from './useResource'
import { getDb } from '../db/client'

export function useMembers(communityId = null) {
  const resource = useResource(
    'person_community_memberships',
    communityId ? { community_id: communityId } : {},
  )

  async function listActive() {
    const db = await getDb()
    if (communityId) {
      const { rows } = await db.query(
        'SELECT * FROM person_community_memberships WHERE left_at IS NULL AND community_id = $1 ORDER BY joined_at DESC',
        [communityId],
      )
      resource.items.value = rows
      return rows
    } else {
      const { rows } = await db.query(
        'SELECT * FROM person_community_memberships WHERE left_at IS NULL ORDER BY joined_at DESC',
        [],
      )
      resource.items.value = rows
      return rows
    }
  }

  return { ...resource, listActive }
}
