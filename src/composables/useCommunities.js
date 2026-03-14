import { useResource } from './useResource'
import { getDb } from '../db/client'

export function useCommunities() {
  const resource = useResource('communities')

  async function findBySlug(slug) {
    const db = await getDb()
    const { rows } = await db.query('SELECT * FROM communities WHERE slug = $1 LIMIT 1', [slug])
    resource.current.value = rows[0] ?? null
    return resource.current.value
  }

  async function listPublic() {
    return resource.list({ privacy: 'public' })
  }

  return { ...resource, findBySlug, listPublic }
}
