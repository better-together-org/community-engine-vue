<template>
  <BCard class="bt-request-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-request-card__title mb-0">
            <span class="text-muted me-1">Seeking:</span>{{ request.title }}
          </h5>
          <slot name="sync-badge"><SyncBadge :item="request" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <div class="d-flex align-items-center gap-2 mb-2">
          <BBadge :variant="statusVariant">{{ request.status }}</BBadge>
          <span class="bt-request-card__credits">
            <strong>{{ request.time_credits }}</strong> time credit{{ request.time_credits !== 1 ? 's' : '' }}
          </span>
          <BBadge v-if="request.category" variant="outline-secondary">{{ request.category }}</BBadge>
        </div>
      </slot>
      <slot name="body">
        <BCardText>{{ truncatedDescription }}</BCardText>
      </slot>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center gap-2">
          <BButton variant="outline-warning" size="sm" @click="$emit('view', request)">Fulfill Request</BButton>
          <ExtensionSlot target="RequestCard" slot="footer" :context="{ item: request }" />
        </div>
      </slot>
    </template>
  </BCard>
</template>
<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BCardText, BBadge, BButton } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'
const props = defineProps({ request: { type: Object, required: true } })
defineEmits(['view'])
const truncatedDescription = computed(() => { const d = props.request.description || ''; return d.length > 150 ? d.slice(0, 150) + '…' : d })
const statusVariant = computed(() => ({ open: 'success', fulfilled: 'info', withdrawn: 'secondary' }[props.request.status] ?? 'secondary'))
</script>
