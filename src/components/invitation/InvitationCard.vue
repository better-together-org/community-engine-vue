<template>
  <BCard class="bt-invitation-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <div>
            <h6 class="mb-0">{{ invitation.name || invitation.email }}</h6>
            <small class="text-muted">{{ invitation.email }}</small>
          </div>
          <slot name="sync-badge"><SyncBadge :item="invitation" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <div class="d-flex align-items-center gap-2 mt-2">
          <BBadge :variant="statusVariant">{{ invitation.status }}</BBadge>
          <small v-if="invitation.expires_at" class="text-muted">Expires {{ formattedExpiry }}</small>
        </div>
      </slot>
      <slot name="body" />
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <ExtensionSlot target="InvitationCard" slot="footer" :context="{ item: invitation }" />
      </slot>
    </template>
  </BCard>
</template>
<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BBadge } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'
const props = defineProps({ invitation: { type: Object, required: true } })
const statusVariant = computed(() => ({ pending: 'warning', accepted: 'success', expired: 'secondary' }[props.invitation.status] ?? 'secondary'))
const formattedExpiry = computed(() => {
  if (!props.invitation.expires_at) return ''
  return new Date(props.invitation.expires_at).toLocaleDateString()
})
</script>
