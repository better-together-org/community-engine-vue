<template>
  <div class="bt-page-community-page">
    <div v-if="loading" class="text-center p-4 text-muted">Loading…</div>
    <div v-else-if="!current" class="text-center p-4 text-muted">Page not found.</div>
    <PageDetail v-else :page="current" />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PageDetail from '../../components/page/PageDetail.vue'
import { usePages } from '../../composables/usePages'
const route = useRoute()
const { current, loading, get } = usePages()
onMounted(() => get(route.params.id))
</script>
