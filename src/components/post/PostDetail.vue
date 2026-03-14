<template>
  <article class="bt-post-detail" v-if="post">
    <slot name="header">
      <img v-if="post.cover_image_url" :src="post.cover_image_url" :alt="post.title" class="bt-post-detail__cover" />
    </slot>

    <div class="bt-post-detail__content">
      <slot name="title">
        <div class="d-flex align-items-center gap-2 mb-2">
          <h1 class="bt-post-detail__title mb-0">{{ post.title }}</h1>
          <slot name="sync-badge"><SyncBadge :item="post" /></slot>
        </div>
      </slot>

      <slot name="meta">
        <p class="text-muted mb-3">
          <span v-if="post.published_at">{{ formattedDate }}</span>
          <BBadge :variant="privacyVariant" class="ms-2">{{ post.privacy }}</BBadge>
        </p>
      </slot>

      <slot name="body">
        <div class="bt-post-detail__body">{{ post.content }}</div>
      </slot>

      <slot name="footer">
        <div class="bt-post-detail__footer mt-4">
          <ExtensionSlot target="PostDetail" slot="footer" :context="{ item: post }" />
        </div>
      </slot>
    </div>
  </article>
  <div v-else-if="loading"><BSpinner label="Loading post…" /></div>
  <div v-else><BAlert variant="warning" :model-value="true">Post not found.</BAlert></div>
</template>

<script setup>
import { computed } from 'vue'
import { BBadge, BSpinner, BAlert } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'

const props = defineProps({
  post: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})

const formattedDate = computed(() => {
  if (!props.post?.published_at) return ''
  return new Date(props.post.published_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  })
})
const privacyVariant = computed(() => ({
  public: 'success', private: 'danger', protected: 'warning',
}[props.post?.privacy] ?? 'secondary'))
</script>

<style scoped lang="scss">
.bt-post-detail__cover { width: 100%; max-height: 300px; object-fit: cover; border-radius: 8px; margin-bottom: 1.5rem; }
.bt-post-detail__title { font-size: 1.75rem; font-weight: 700; }
.bt-post-detail__body { line-height: 1.75; white-space: pre-wrap; }
</style>
