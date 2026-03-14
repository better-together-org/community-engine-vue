<template>
  <BCard class="bt-offer-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-offer-card__title mb-0">{{ offer.title }}</h5>
          <slot name="sync-badge"><SyncBadge :item="offer" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <div class="d-flex align-items-center gap-2 mb-2">
          <BBadge :variant="statusVariant">{{ offer.status }}</BBadge>
          <span class="bt-offer-card__credits">
            {{ t('bt.joatu.offers.credits_display', offer.time_credits) }}
          </span>
          <BBadge v-if="offer.category" variant="outline-secondary">{{ offer.category }}</BBadge>
        </div>
      </slot>
      <slot name="body">
        <BCardText>{{ truncatedDescription }}</BCardText>
      </slot>
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <div class="d-flex align-items-center gap-2">
          <BButton variant="outline-success" size="sm" @click="$emit('view', offer)">
            {{ t('bt.joatu.offers.view') }}
          </BButton>
          <ExtensionSlot target="OfferCard" slot="footer" :context="{ item: offer }" />
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
const props = defineProps({ offer: { type: Object, required: true } })
defineEmits(['view'])
const truncatedDescription = computed(() => { const d = props.offer.description || ''; return d.length > 150 ? d.slice(0, 150) + '…' : d })
const statusVariant = computed(() => ({ open: 'success', fulfilled: 'info', withdrawn: 'secondary' }[props.offer.status] ?? 'secondary'))
</script>
