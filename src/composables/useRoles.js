import { computed } from 'vue'
import { useResource } from './useResource'
import { useAuthStore } from '../stores/auth'

/**
 * useRoles — manages roles and person_roles assignments.
 *
 * Roles are scoped to a resource (community, etc.) or global (resource_type = null).
 * The current person's effective roles are derived from their person_roles records.
 */
export function useRoles(resourceType = null, resourceId = null) {
  const auth = useAuthStore()

  const rolesResource = useResource('roles')
  const personRolesResource = useResource('person_roles')

  // All roles for this resource scope
  const scopedRoles = computed(() =>
    rolesResource.items.value.filter(r =>
      r.resource_type === resourceType && r.resource_id === resourceId
    )
  )

  // Current person's role assignments in this scope
  const myAssignments = computed(() =>
    personRolesResource.items.value.filter(pr =>
      pr.person_id === auth.personId &&
      pr.resource_type === resourceType &&
      pr.resource_id === resourceId
    )
  )

  // Slugs the current person holds in this scope
  const mySlugs = computed(() => {
    const assignedRoleIds = new Set(myAssignments.value.map(pr => pr.role_id))
    return rolesResource.items.value
      .filter(r => assignedRoleIds.has(r.id))
      .map(r => r.slug)
  })

  /**
   * Check if the current person has a given role slug in this scope.
   * Also returns true for 'admin' if the person has any admin role anywhere.
   */
  function hasRole(slug) {
    return mySlugs.value.includes(slug)
  }

  /**
   * Check if person has any of the given role slugs.
   */
  function hasAnyRole(...slugs) {
    return slugs.some(s => hasRole(s))
  }

  async function loadRoles() {
    await rolesResource.list()
    await personRolesResource.list()
  }

  async function grantRole(personId, roleId) {
    const { nanoid } = await import('nanoid')
    return personRolesResource.create({
      id: nanoid(),
      person_id: personId,
      role_id: roleId,
      resource_type: resourceType,
      resource_id: resourceId,
      granted_by_id: auth.personId,
    })
  }

  async function revokeRole(personRoleId) {
    return personRolesResource.destroy(personRoleId)
  }

  return {
    // Data
    roles: rolesResource.items,
    personRoles: personRolesResource.items,
    scopedRoles,
    myAssignments,
    mySlugs,
    // Checks
    hasRole,
    hasAnyRole,
    // Actions
    loadRoles,
    grantRole,
    revokeRole,
    // Loading state
    loading: rolesResource.loading,
  }
}
