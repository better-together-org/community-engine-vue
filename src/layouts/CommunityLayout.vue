<template>
  <div class="bt-community-layout">
    <div v-if="loading" class="text-center py-5">
      <BSpinner :label="t('bt.communities.loading')" />
    </div>
    <div v-else-if="!community" class="container py-5">
      <BAlert variant="warning" :model-value="true">{{ t('bt.communities.not_found') }}</BAlert>
    </div>
    <template v-else>
      <CommunityHeader :community="community" />
      <nav class="bt-community-nav bg-light border-bottom">
        <div class="container">
          <ul class="nav nav-pills py-2">
            <li class="nav-item" v-for="link in communityNav" :key="link.name">
              <RouterLink :to="{ name: link.name, params: { communitySlug: communitySlug } }"
                          class="nav-link" active-class="active">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>
      </nav>
      <div class="container py-4">
        <RouterView />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { BSpinner, BAlert } from 'bootstrap-vue-next'
import { useCommunityStore } from '../stores/communities'
import { useCommunities } from '../composables/useCommunities'
import CommunityHeader from '../components/community/CommunityHeader.vue'

const { t } = useI18n()
const route = useRoute()
const communityStore = useCommunityStore()
const { findBySlug, current: community, loading } = useCommunities()

const communitySlug = ref(route.params.communitySlug)

const communityNav = computed(() => [
  { name: 'CommunityHome', label: t('bt.navigation.home') },
  { name: 'CommunityPosts', label: t('bt.navigation.posts') },
  { name: 'CommunityEvents', label: t('bt.navigation.events') },
  { name: 'CommunityMembers', label: t('bt.navigation.members') },
  { name: 'CommunityConversations', label: t('bt.navigation.conversations') },
])

async function loadCommunity(slug) {
  communitySlug.value = slug
  const c = await findBySlug(slug)
  if (c) communityStore.activeCommunity = c
}

onMounted(() => loadCommunity(route.params.communitySlug))
watch(() => route.params.communitySlug, (slug) => { if (slug) loadCommunity(slug) })
</script>
