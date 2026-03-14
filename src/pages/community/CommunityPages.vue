<template>
  <div class="bt-page-community-pages">
    <h2 class="mb-4">
      {{ t('bt.pages.heading') }}
    </h2>
    <PageList
      :pages="items"
      :loading="loading"
      @view="viewPage"
    />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import PageList from '../../components/page/PageList.vue'
import { usePages } from '../../composables/usePages'
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { items, loading, list } = usePages(route.params.communitySlug)
onMounted(() => list())
function viewPage(page) { router.push({ name: 'CommunityPage', params: { id: page.id } }) }
</script>
