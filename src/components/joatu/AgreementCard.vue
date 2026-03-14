<template>
  <BCard class="bt-agreement-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-agreement-card__title mb-0">
            {{ agreement.time_credits }} time credit{{ agreement.time_credits !== 1 ? 's' : '' }}
          </h5>
          <slot name="sync-badge"><SyncBadge :item="agreement" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <div class="d-flex align-items-center gap-2 mb-2">
          <BBadge :variant="statusVariant">{{ agreement.status }}</BBadge>
          <small v-if="agreement.agreed_at" class="text-muted">Agreed {{ formattedAgreedAt }}</small>
        </div>
      </slot>
      <slot name="body">
        <BCardText v-if="agreement.notes" class="text-muted">{{ agreement.notes }}</BCardText>
      </slot>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <ExtensionSlot target="AgreementCard" slot="footer" :context="{ item: agreement }" />
      </slot>
    </template>
  </BCard>
</template>
<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BCardText, BBadge } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'
const props = defineProps({ agreement: { type: Object, required: true } })
const statusVariant = computed(() => ({ pending: 'warning', active: 'info', completed: 'success', disputed: 'danger' }[props.agreement.status] ?? 'secondary'))
const formattedAgreedAt = computed(() => { if (!props.agreement.agreed_at) return ''; return new Date(props.agreement.agreed_at).toLocaleDateString() })
</script>
