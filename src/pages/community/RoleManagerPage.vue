<template>
  <div class="bt-role-manager-page">
    <RoleGate
      role="admin"
      :resource-type="'community'"
      :resource-id="communitySlug"
    >
      <BCard>
        <template #header>
          <h2 class="h5 mb-0">
            {{ t('bt.roles.title') }}
          </h2>
        </template>

        <div
          v-if="loading"
          class="text-center py-4"
        >
          <BSpinner :label="t('bt.person.loading')" />
        </div>

        <div
          v-else-if="!items.length"
          class="text-muted"
        >
          {{ t('bt.person.members_empty') }}
        </div>

        <BTableSimple
          v-else
          responsive
        >
          <BThead>
            <BTr>
              <BTh>{{ t('bt.person.name_label') }}</BTh>
              <BTh>{{ t('bt.navigation.members') }}</BTh>
              <BTh>{{ t('bt.roles.assign') }}</BTh>
              <BTh />
            </BTr>
          </BThead>
          <BTbody>
            <MemberRoleRow
              v-for="member in items"
              :key="member.id"
              :member="member"
              resource-type="community"
              :resource-id="communitySlug"
            />
          </BTbody>
        </BTableSimple>

        <template #footer>
          <ExtensionSlot
            target="RoleManagerPage"
            :context="{ communitySlug }"
          />
        </template>
      </BCard>

      <template #fallback>
        <BAlert
          variant="warning"
          :model-value="true"
        >
          {{ t('bt.errors.not_found') }}
        </BAlert>
      </template>
    </RoleGate>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BCard, BSpinner, BAlert, BTableSimple, BThead, BTbody, BTr, BTh } from 'bootstrap-vue-next'
import { useMembers } from '../../composables/useMembers'
import { useRoles } from '../../composables/useRoles'
import RoleGate from '../../components/role/RoleGate.vue'
import MemberRoleRow from '../../components/community/MemberRoleRow.vue'
import ExtensionSlot from '../../components/shared/ExtensionSlot.vue'

const { t } = useI18n()
const route = useRoute()
const communitySlug = route.params.communitySlug

const { items, loading, listActive } = useMembers(communitySlug)
const { loadRoles } = useRoles('community', communitySlug)

onMounted(async () => {
  await Promise.all([listActive(), loadRoles()])
})
</script>
