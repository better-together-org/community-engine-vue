<template>
  <div class="bt-post-list">
    <slot name="header" />
    <div v-if="loading">
      <slot name="loading">
        <BSpinner :label="t('bt.posts.loading')" />
      </slot>
    </div>
    <div v-else-if="!posts.length">
      <slot name="empty">
        <p class="text-muted">
          {{ t('bt.posts.list_empty') }}
        </p>
      </slot>
    </div>
    <div
      v-else
      class="bt-post-list__items"
    >
      <div
        v-for="(post, index) in posts"
        :key="post.id"
        class="mb-3"
      >
        <slot
          name="item"
          :item="post"
          :index="index"
        >
          <PostCard
            :post="post"
            @view="$emit('view', post)"
          />
        </slot>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BSpinner } from 'bootstrap-vue-next'
import PostCard from './PostCard.vue'

const { t } = useI18n()

defineProps({
  posts: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
