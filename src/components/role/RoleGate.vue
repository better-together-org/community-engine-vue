<template>
  <slot v-if="allowed" />
  <slot
    v-else
    name="fallback"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useRoles } from '../../composables/useRoles'

/**
 * RoleGate — conditionally renders children based on the current person's roles.
 *
 * Usage:
 *   <!-- Require a single role -->
 *   <RoleGate role="admin" :resource-type="'community'" :resource-id="community.id">
 *     <EditButton />
 *     <template #fallback><p>Not authorized</p></template>
 *   </RoleGate>
 *
 *   <!-- Require any of several roles -->
 *   <RoleGate :any-role="['admin', 'moderator']" :resource-type="'community'" :resource-id="community.id">
 *     <ModerateButton />
 *   </RoleGate>
 *
 *   <!-- No resource scope — instance-wide role -->
 *   <RoleGate role="superadmin">
 *     <AdminPanel />
 *   </RoleGate>
 */
const props = defineProps({
  // Single required role slug
  role: {
    type: String,
    default: null,
  },
  // Array of role slugs — allowed if person has ANY of them
  anyRole: {
    type: Array,
    default: null,
  },
  // Resource scope (optional — leave null for instance-wide roles)
  resourceType: {
    type: String,
    default: null,
  },
  resourceId: {
    type: String,
    default: null,
  },
})

const { hasRole, hasAnyRole } = useRoles(props.resourceType, props.resourceId)

const allowed = computed(() => {
  if (props.anyRole?.length) return hasAnyRole(...props.anyRole)
  if (props.role) return hasRole(props.role)
  return false
})
</script>
