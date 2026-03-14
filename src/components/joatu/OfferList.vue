<template>
  <div class="bt-offer-list">
    <slot name="header" />
    <div v-if="loading" class="bt-offer-list__loading">
      <slot name="loading"><div class="text-center p-4 text-muted">{{ t('bt.joatu.offers.loading') }}</div></slot>
    </div>
    <div v-else-if="!offers.length" class="bt-offer-list__empty">
      <slot name="empty"><div class="text-center p-4 text-muted">{{ t('bt.joatu.offers.list_empty') }}</div></slot>
    </div>
    <template v-else>
      <slot
        v-for="(offer, index) in offers"
        :key="offer.id"
        name="item"
        :item="offer"
        :index="index"
      >
        <OfferCard
          :offer="offer"
          class="mb-3"
          @view="$emit('view', offer)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import OfferCard from './OfferCard.vue'
const { t } = useI18n()
defineProps({
  offers: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
