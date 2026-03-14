<template>
  <div class="bt-page-community-conversation">
    <div
      v-if="loading"
      class="text-center p-4 text-muted"
    >
      {{ t('bt.pages.loading') }}
    </div>
    <div
      v-else-if="!current"
      class="text-center p-4 text-muted"
    >
      {{ t('bt.conversations.not_found') }}
    </div>
    <ConversationDetail
      v-else
      :conversation="current"
    />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import ConversationDetail from '../../components/conversation/ConversationDetail.vue'
import { useConversations } from '../../composables/useConversations'
const { t } = useI18n()
const route = useRoute()
const { current, loading, get } = useConversations()
onMounted(() => get(route.params.id))
</script>
