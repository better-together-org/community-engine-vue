<template>
  <div class="bt-community-post">
    <RouterLink :to="{ name: 'CommunityPosts', params: { communitySlug: route.params.communitySlug } }" class="btn btn-link ps-0">
      {{ t('bt.actions.back') }}
    </RouterLink>
    <PostDetail :post="current" :loading="loading" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePosts } from '../../composables/usePosts'
import PostDetail from '../../components/post/PostDetail.vue'

const { t } = useI18n()

const route = useRoute()
const { current, loading, get } = usePosts(route.params.communitySlug)
onMounted(() => get(route.params.id))
</script>
