<template>
  <BCard class="bt-request-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-request-card__title mb-0">
            <span class="text-muted me-1">{{ t('bt.joatu.requests.seeking') }}</span>{{ request.title }}
          </h5>
          <slot name="sync-badge">
            <SyncBadge :item="request" />
          </slot>
        </div>
      </slot>
      <slot name="meta">
        <div class="d-flex align-items-center gap-2 mb-2">
          <BBadge :variant="statusVariant">
            {{ request.status }}
          </BBadge>
          <span class="bt-request-card__credits">
            {{ t('bt.joatu.offers.credits_display', request.time_credits) }}
          </span>
          <BBadge
            v-if="request.category"
            variant="outline-secondary"
          >
            {{ request.category }}
          </BBadge>
        </div>
      </slot>
      <slot name="body">
        <BCardText>{{ truncatedDescription }}</BCardText>
      </slot>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center gap-2">
          <BButton
            variant="outline-warning"
            size="sm"
            @click="$emit('view', request)"
          >
            {{ t('bt.joatu.requests.fulfill') }}
          </BButton>
          <ExtensionSlot
            slot="footer"
            target="RequestCard"
            :context="{ item: request }"
          />
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
const props = defineProps({ request: { type: Object, required: true } })
defineEmits(['view'])
const truncatedDescription = computed(() => { const d = props.request.description || ''; return d.length > 150 ? d.slice(0, 150) + '…' : d })
const statusVariant = computed(() => ({ open: 'success', fulfilled: 'info', withdrawn: 'secondary' }[props.request.status] ?? 'secondary'))
</script>
