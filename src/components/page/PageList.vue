<template>
  <div class="bt-page-list">
    <slot name="header" />
    <div v-if="loading" class="bt-page-list__loading">
      <slot name="loading"><div class="text-center p-4 text-muted">{{ t('bt.pages.loading') }}</div></slot>
    </div>
    <div v-else-if="!pages.length" class="bt-page-list__empty">
      <slot name="empty"><div class="text-center p-4 text-muted">{{ t('bt.pages.list_empty') }}</div></slot>
    </div>
    <template v-else>
      <slot
        v-for="(page, index) in pages"
        :key="page.id"
        name="item"
        :item="page"
        :index="index"
      >
        <PageCard
          :page="page"
          class="mb-3"
          @view="$emit('view', page)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import PageCard from './PageCard.vue'
const { t } = useI18n()
defineProps({
  pages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
