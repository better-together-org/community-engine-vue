<template>
  <div class="bt-page-community-page">
    <div v-if="loading" class="text-center p-4 text-muted">{{ t('bt.pages.loading') }}</div>
    <div v-else-if="!current" class="text-center p-4 text-muted">{{ t('bt.pages.not_found') }}</div>
    <PageDetail v-else :page="current" />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import PageDetail from '../../components/page/PageDetail.vue'
import { usePages } from '../../composables/usePages'
const { t } = useI18n()
const route = useRoute()
const { current, loading, get } = usePages()
onMounted(() => get(route.params.id))
</script>
