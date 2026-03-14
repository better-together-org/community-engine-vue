<template>
  <div class="bt-community-settings-page">
    <RoleGate
      role="admin"
      :resource-type="'community'"
      :resource-id="communitySlug"
    >
      <h1 class="h4 mb-4">
        {{ t('bt.community.settings.title') }}
      </h1>

      <!-- General Settings -->
      <BCard class="mb-4">
        <template #header>
          <h2 class="h6 mb-0">
            {{ t('bt.community.settings.general') }}
          </h2>
        </template>
        <div
          v-if="loadingCommunity"
          class="text-center py-3"
        >
          <BSpinner :label="t('bt.communities.loading')" />
        </div>
        <CommunityForm
          v-else-if="community"
          :model="community"
          @submit="handleSave"
        />
      </BCard>

      <!-- Members / Role Management -->
      <BCard class="mb-4">
        <template #header>
          <h2 class="h6 mb-0">
            {{ t('bt.community.settings.members') }}
          </h2>
        </template>
        <RouterLink
          :to="{ name: 'community-role-manager', params: { communitySlug } }"
          class="btn btn-outline-secondary btn-sm"
        >
          {{ t('bt.roles.title') }}
        </RouterLink>
      </BCard>

      <!-- Danger Zone -->
      <BCard border-variant="danger">
        <template #header>
          <h2 class="h6 mb-0 text-danger">
            {{ t('bt.community.settings.danger_zone') }}
          </h2>
        </template>
        <BButton
          variant="outline-danger"
          @click="confirmLeave"
        >
          {{ t('bt.community.settings.leave') }}
        </BButton>
      </BCard>

      <BModal
        v-model="showLeaveConfirm"
        :title="t('bt.community.settings.leave')"
        ok-variant="danger"
        :ok-title="t('bt.community.settings.leave')"
        @ok="handleLeave"
      >
        {{ t('bt.community.settings.leave_confirm') }}
      </BModal>

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
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BCard, BButton, BSpinner, BAlert, BModal } from 'bootstrap-vue-next'
import { useCommunities } from '../../composables/useCommunities'
import RoleGate from '../../components/role/RoleGate.vue'
import CommunityForm from '../../components/CommunityForm.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const communitySlug = route.params.communitySlug

const { current: community, loading: loadingCommunity, findBySlug, update } = useCommunities()

const showLeaveConfirm = ref(false)

onMounted(() => findBySlug(communitySlug))

async function handleSave(formData) {
  if (!community.value) return
  await update(community.value.id, formData)
}

function confirmLeave() {
  showLeaveConfirm.value = true
}

function handleLeave() {
  showLeaveConfirm.value = false
  router.push({ name: 'Communities' })
}
</script>
