import { useResource } from './useResource'
import { useAuthStore } from '../stores/auth'

/**
 * usePersonBlocks — manage block relationships.
 *
 * A block is one-directional: blocker_id → blocked_id.
 * Blocked people are hidden from lists and cannot interact.
 */
export function usePersonBlocks() {
  const auth = useAuthStore()
  const blocksResource = useResource('person_blocks')

  const { items: blocks, loading, create, destroy, list } = blocksResource

  async function blockPerson(blockedId, reason = null) {
    const { nanoid } = await import('nanoid')
    return create({
      id: nanoid(),
      blocker_id: auth.personId,
      blocked_id: blockedId,
      reason,
    })
  }

  async function unblockPerson(blockedId) {
    const record = blocks.value.find(
      b => b.blocker_id === auth.personId && b.blocked_id === blockedId
    )
    if (record) return destroy(record.id)
  }

  function isBlocked(personId) {
    return blocks.value.some(
      b => b.blocker_id === auth.personId && b.blocked_id === personId
    )
  }

  function isBlockedBy(personId) {
    return blocks.value.some(
      b => b.blocker_id === personId && b.blocked_id === auth.personId
    )
  }

  // Filter a list of people/items, removing any that are blocked
  function filterBlocked(items, idKey = 'id') {
    const blockedIds = new Set(
      blocks.value
        .filter(b => b.blocker_id === auth.personId)
        .map(b => b.blocked_id)
    )
    return items.filter(item => !blockedIds.has(item[idKey]))
  }

  return {
    blocks,
    loading,
    loadBlocks: list,
    blockPerson,
    unblockPerson,
    isBlocked,
    isBlockedBy,
    filterBlocked,
  }
}
