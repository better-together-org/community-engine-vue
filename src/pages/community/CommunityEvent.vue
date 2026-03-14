<template>
  <div class="bt-community-event">
    <RouterLink :to="{ name: 'CommunityEvents', params: { communitySlug: route.params.communitySlug } }" class="btn btn-link ps-0">← Back to Events</RouterLink>
    <div v-if="loading"><BSpinner label="Loading event…" /></div>
    <EventCard v-else-if="current" :event="current" />
    <BAlert v-else variant="warning" :model-value="true">Event not found.</BAlert>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { BSpinner, BAlert } from 'bootstrap-vue-next'
import { useEvents } from '../../composables/useEvents'
import EventCard from '../../components/event/EventCard.vue'

const route = useRoute()
const { current, loading, get } = useEvents(route.params.communitySlug)
onMounted(() => get(route.params.id))
</script>
