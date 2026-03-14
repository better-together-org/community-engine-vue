<template>
  <div class="bt-event-list">
    <slot name="header" />
    <div v-if="loading"><slot name="loading"><BSpinner :label="t('bt.events.loading')" /></slot></div>
    <div v-else-if="!events.length"><slot name="empty"><p class="text-muted">{{ t('bt.events.list_empty') }}</p></slot></div>
    <div v-else>
      <div v-for="(event, index) in events" :key="event.id" class="mb-3">
        <slot name="item" :item="event" :index="index">
          <EventCard :event="event" @view="$emit('view', event)" />
        </slot>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BSpinner } from 'bootstrap-vue-next'
import EventCard from './EventCard.vue'

const { t } = useI18n()

defineProps({ events: { type: Array, default: () => [] }, loading: { type: Boolean, default: false } })
defineEmits(['view'])
</script>
