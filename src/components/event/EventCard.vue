<template>
  <BCard class="bt-event-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-event-card__name mb-0">{{ event.name }}</h5>
          <slot name="sync-badge"><SyncBadge :item="event" /></slot>
        </div>
      </slot>

      <slot name="meta">
        <div class="bt-event-card__meta mb-2">
          <small class="text-muted">
            <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
            <span v-if="event.starts_at">📅 {{ formattedDate }}</span>
          </small>
          <BBadge :variant="privacyVariant" class="ms-2">{{ event.privacy }}</BBadge>
        </div>
      </slot>

      <slot name="body">
        <BCardText class="bt-event-card__description">{{ truncatedDescription }}</BCardText>
      </slot>
    </BCardBody>

    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center gap-2">
          <BButton variant="outline-primary" size="sm" @click="$emit('view', event)">
            {{ t('bt.events.view') }}
          </BButton>
          <ExtensionSlot target="EventCard" slot="footer" :context="{ item: event }" />
        </div>
      </slot>
    </template>
  </BCard>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BCard, BCardBody, BCardText, BBadge, BButton } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'

const { t } = useI18n()

const props = defineProps({ event: { type: Object, required: true } })
defineEmits(['view'])

const formattedDate = computed(() => {
  if (!props.event.starts_at) return ''
  const start = new Date(props.event.starts_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  if (!props.event.ends_at) return start
  const end = new Date(props.event.ends_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${start} – ${end}`
})
const privacyVariant = computed(() => ({ public: 'success', private: 'danger', protected: 'warning' }[props.event.privacy] ?? 'secondary'))
const truncatedDescription = computed(() => {
  const d = props.event.description || ''
  return d.length > 150 ? d.slice(0, 150) + '…' : d
})
</script>
