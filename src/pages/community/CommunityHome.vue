<template>
  <div class="bt-community-home">
    <BRow>
      <BCol md="8">
        <h2>{{ t('bt.posts.recent') }}</h2>
        <PostList
          :posts="recentPosts"
          :loading="postsLoading"
          @view="goToPost"
        />
      </BCol>
      <BCol md="4">
        <h2>{{ t('bt.events.upcoming') }}</h2>
        <EventList
          :events="upcomingEvents"
          :loading="eventsLoading"
          @view="goToEvent"
        />
      </BCol>
    </BRow>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BRow, BCol } from 'bootstrap-vue-next'
import { usePosts } from '../../composables/usePosts'
import { useEvents } from '../../composables/useEvents'
import PostList from '../../components/post/PostList.vue'
import EventList from '../../components/event/EventList.vue'

const { t } = useI18n()

const route = useRoute()
const router = useRouter()
const communityId = route.params.communitySlug

const { items: recentPosts, loading: postsLoading, listPublished } = usePosts(communityId)
const { items: upcomingEvents, loading: eventsLoading, listUpcoming } = useEvents(communityId)

onMounted(async () => {
  await Promise.all([listPublished(), listUpcoming()])
})

function goToPost(post) { router.push({ name: 'CommunityPost', params: { ...route.params, id: post.id } }) }
function goToEvent(event) { router.push({ name: 'CommunityEvent', params: { ...route.params, id: event.id } }) }
</script>
