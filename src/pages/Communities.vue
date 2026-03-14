<template>
  <div class="bt-communities-page">
    <div class="container py-4">
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h1>{{ t('bt.navigation.communities') }}</h1>
        <BButton v-if="authStore.isAuthenticated" variant="primary" @click="showCreateForm = true">
          {{ t('bt.communities.new') }}
        </BButton>
      </div>

      <CommunityList
        :communities="items"
        :loading="loading"
        @view="goToCommunity"
      />

      <BModal v-model="showCreateForm" :title="t('bt.communities.create')" @ok.prevent="createCommunity">
        <CommunityForm @submit="createCommunity" />
      </BModal>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BButton, BModal } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useCommunities } from '../composables/useCommunities'
import CommunityList from '../components/community/CommunityList.vue'
import CommunityForm from '../components/CommunityForm.vue'

const { t } = useI18n()

const router = useRouter()
const authStore = useAuthStore()
const { items, loading, list, create } = useCommunities()
const showCreateForm = ref(false)

onMounted(() => list())

function goToCommunity(community) {
  router.push({ name: 'CommunityHome', params: { communitySlug: community.slug } })
}

async function createCommunity(formData) {
  await create(formData)
  showCreateForm.value = false
}
</script>
