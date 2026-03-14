<template>
  <div class="bt-agreement-list">
    <slot name="header" />
    <div v-if="loading" class="bt-agreement-list__loading">
      <slot name="loading"><div class="text-center p-4 text-muted">{{ t('bt.joatu.agreements.loading') }}</div></slot>
    </div>
    <div v-else-if="!agreements.length" class="bt-agreement-list__empty">
      <slot name="empty"><div class="text-center p-4 text-muted">{{ t('bt.joatu.agreements.list_empty') }}</div></slot>
    </div>
    <template v-else>
      <slot
        v-for="(agreement, index) in agreements"
        :key="agreement.id"
        name="item"
        :item="agreement"
        :index="index"
      >
        <AgreementCard
          :agreement="agreement"
          class="mb-3"
          @view="$emit('view', agreement)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import AgreementCard from './AgreementCard.vue'
const { t } = useI18n()
defineProps({
  agreements: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
