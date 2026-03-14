<template>
  <div class="bt-community-events">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2>{{ t('bt.navigation.events') }}</h2>
      <BButton
        v-if="authStore.isAuthenticated"
        variant="primary"
        @click="showForm = true"
      >
        {{ t('bt.events.create') }}
      </BButton>
    </div>
    <BModal
      v-model="showForm"
      :title="t('bt.events.create')"
      hide-footer
    >
      <EventForm
        :community-id="communitySlug"
        @submit="createEvent"
      />
    </BModal>
    <EventList
      :events="items"
      :loading="loading"
      @view="goToEvent"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BButton, BModal } from 'bootstrap-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useEvents } from '../../composables/useEvents'
import EventList from '../../components/event/EventList.vue'
import EventForm from '../../components/event/EventForm.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const communitySlug = route.params.communitySlug
const { items, loading, listUpcoming, create } = useEvents(communitySlug)
const showForm = ref(false)

onMounted(() => listUpcoming())
async function createEvent(formData) {
  await create(formData)
  showForm.value = false
}
function goToEvent(event) {
  router.push({ name: 'CommunityEvent', params: { ...route.params, id: event.id } })
}
</script>
