<template>
  <div class="bt-community-posts">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2>Posts</h2>
      <BButton v-if="authStore.isAuthenticated" variant="primary" @click="showForm = true">New Post</BButton>
    </div>
    <BModal v-model="showForm" title="New Post" hide-footer>
      <PostForm :community-id="communitySlug" @submit="createPost" />
    </BModal>
    <PostList :posts="items" :loading="loading" @view="goToPost" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BButton, BModal } from 'bootstrap-vue-next'
import { useAuthStore } from '../../stores/auth'
import { usePosts } from '../../composables/usePosts'
import PostList from '../../components/post/PostList.vue'
import PostForm from '../../components/post/PostForm.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const communitySlug = route.params.communitySlug
const { items, loading, listPublished, create } = usePosts(communitySlug)
const showForm = ref(false)

onMounted(() => listPublished())
async function createPost(formData) {
  await create(formData)
  showForm.value = false
}
function goToPost(post) {
  router.push({ name: 'CommunityPost', params: { ...route.params, id: post.id } })
}
</script>
