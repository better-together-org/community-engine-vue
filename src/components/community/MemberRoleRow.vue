<template>
  <tr class="bt-member-role-row">
    <td class="align-middle">
      <div class="d-flex align-items-center gap-2">
        <PersonAvatar :person="member" :size="32" />
        <span>{{ member.name || member.handle || t('bt.person.unknown') }}</span>
      </div>
    </td>
    <td class="align-middle">
      <span v-if="memberRoles.length" class="d-flex flex-wrap gap-1">
        <RoleBadge
          v-for="role in memberRoles"
          :key="role.id"
          :role="role"
        />
      </span>
      <span v-else class="text-muted small">{{ t('bt.roles.no_roles') }}</span>
    </td>
    <td class="align-middle" style="min-width: 180px">
      <RoleSelector
        v-model="selectedRoleId"
        :resource-type="resourceType"
        :resource-id="resourceId"
      />
    </td>
    <td class="align-middle">
      <div class="d-flex gap-1">
        <BButton
          variant="outline-primary"
          size="sm"
          :disabled="!selectedRoleId || grantPending"
          @click="handleGrant"
        >
          {{ t('bt.roles.assign') }}
        </BButton>
        <BButton
          v-for="pr in memberAssignments"
          :key="pr.id"
          variant="outline-danger"
          size="sm"
          :disabled="revokePending"
          @click="handleRevoke(pr.id)"
        >
          {{ t('bt.roles.revoke') }}
        </BButton>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BButton } from 'bootstrap-vue-next'
import { useRoles } from '../../composables/useRoles'
import PersonAvatar from '../person/PersonAvatar.vue'
import RoleBadge from '../role/RoleBadge.vue'
import RoleSelector from '../role/RoleSelector.vue'

const { t } = useI18n()

const props = defineProps({
  member: { type: Object, required: true },
  resourceType: { type: String, default: null },
  resourceId: { type: String, default: null },
})

const { roles, personRoles, grantRole, revokeRole } = useRoles(props.resourceType, props.resourceId)

const selectedRoleId = ref(null)
const grantPending = ref(false)
const revokePending = ref(false)

const memberAssignments = computed(() =>
  personRoles.value.filter(
    (pr) =>
      pr.person_id === props.member.person_id &&
      pr.resource_type === props.resourceType &&
      pr.resource_id === props.resourceId,
  ),
)

const memberRoles = computed(() => {
  const ids = new Set(memberAssignments.value.map((pr) => pr.role_id))
  return roles.value.filter((r) => ids.has(r.id))
})

async function handleGrant() {
  if (!selectedRoleId.value) return
  grantPending.value = true
  try {
    await grantRole(props.member.person_id, selectedRoleId.value)
    selectedRoleId.value = null
  } finally {
    grantPending.value = false
  }
}

async function handleRevoke(personRoleId) {
  revokePending.value = true
  try {
    await revokeRole(personRoleId)
  } finally {
    revokePending.value = false
  }
}
</script>
