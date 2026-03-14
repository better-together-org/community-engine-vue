<template>
  <article class="bt-page-detail">
    <header class="bt-page-detail__header mb-4">
      <h1 class="bt-page-detail__title">{{ page.title }}</h1>
      <div class="d-flex align-items-center gap-2">
        <small v-if="page.published_at" class="text-muted">{{ formattedDate }}</small>
        <SyncBadge :item="page" />
      </div>
    </header>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="bt-page-detail__content" v-html="page.content" />
  </article>
</template>
<script setup>
import { computed } from 'vue'
import SyncBadge from '../sync/SyncBadge.vue'
const props = defineProps({ page: { type: Object, required: true } })
const formattedDate = computed(() => {
  if (!props.page.published_at) return ''
  return new Date(props.page.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
})
</script>
<style scoped lang="scss">
.bt-page-detail__content { line-height: 1.7; }
.bt-page-detail__content :deep(img) { max-width: 100%; height: auto; }
.bt-page-detail__content :deep(h2) { margin-top: 2rem; }
</style>
