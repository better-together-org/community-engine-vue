<template>
  <BCard class="bt-post-card">
    <template #header>
      <slot name="header">
        <div v-if="post.cover_image_url" class="bt-post-card__cover">
          <img :src="post.cover_image_url" :alt="post.title" />
        </div>
      </slot>
    </template>

    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-post-card__title mb-0">{{ post.title }}</h5>
          <slot name="sync-badge"><SyncBadge :item="post" /></slot>
        </div>
      </slot>

      <slot name="meta">
        <div class="bt-post-card__meta mb-2">
          <small class="text-muted">
            <span v-if="post.published_at">{{ formattedDate }}</span>
            <BBadge :variant="privacyVariant" class="ms-2">{{ post.privacy }}</BBadge>
          </small>
        </div>
      </slot>

      <slot name="body">
        <BCardText class="bt-post-card__body">{{ truncatedContent }}</BCardText>
      </slot>
    </BCardBody>

    <template #footer>
      <slot name="footer">
        <div class="bt-post-card__actions d-flex align-items-center gap-2">
          <BButton variant="outline-primary" size="sm" @click="$emit('view', post)">Read more</BButton>
          <ExtensionSlot target="PostCard" slot="footer" :context="{ item: post }" />
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

const props = defineProps({
  post: { type: Object, required: true },
})
defineEmits(['view'])

const truncatedContent = computed(() => {
  const c = props.post.content || ''
  return c.length > 200 ? c.slice(0, 200) + '…' : c
})

const formattedDate = computed(() => {
  if (!props.post.published_at) return ''
  return new Date(props.post.published_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  })
})

const privacyVariant = computed(() => ({
  public: 'success', private: 'danger', protected: 'warning',
}[props.post.privacy] ?? 'secondary'))
</script>

<style scoped lang="scss">
.bt-post-card__cover img { width: 100%; height: 160px; object-fit: cover; }
.bt-post-card__title { font-size: 1rem; font-weight: 600; }
.bt-post-card__body { font-size: 0.875rem; color: #374151; }
.bt-post-card__actions { flex-wrap: wrap; }
</style>
