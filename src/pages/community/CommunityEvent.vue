<template>
  <div class="bt-community-event">
    <RouterLink :to="{ name: 'CommunityEvents', params: { communitySlug: route.params.communitySlug } }" class="btn btn-link ps-0">
      {{ t('bt.actions.back') }}
    </RouterLink>
    <div v-if="loading"><BSpinner :label="t('bt.events.loading')" /></div>
    <EventCard v-else-if="current" :event="current" />
    <BAlert v-else variant="warning" :model-value="true">{{ t('bt.events.not_found') }}</BAlert>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BSpinner, BAlert } from 'bootstrap-vue-next'
import { useEvents } from '../../composables/useEvents'
import EventCard from '../../components/event/EventCard.vue'

const { t } = useI18n()

const route = useRoute()
const { current, loading, get } = useEvents(route.params.communitySlug)
onMounted(() => get(route.params.id))
</script>
