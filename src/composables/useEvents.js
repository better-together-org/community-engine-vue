import { useResource } from './useResource'
import { getDb } from '../db/client'

export function useEvents(communityId = null) {
  const resource = useResource('events', communityId ? { community_id: communityId } : {})

  async function listUpcoming(extraFilters = {}) {
    const db = await getDb()
    const now = new Date().toISOString()
    if (communityId) {
      const { rows } = await db.query(
        'SELECT * FROM events WHERE starts_at >= $1 AND community_id = $2 ORDER BY starts_at ASC',
        [now, communityId],
      )
      resource.items.value = rows
      return rows
    } else {
      const { rows } = await db.query(
        'SELECT * FROM events WHERE starts_at >= $1 ORDER BY starts_at ASC',
        [now],
      )
      resource.items.value = rows
      return rows
    }
  }

  return { ...resource, listUpcoming }
}
