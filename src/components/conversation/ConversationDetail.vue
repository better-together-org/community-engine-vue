<template>
  <div class="bt-conversation-detail">
    <div v-if="conversation" class="bt-conversation-detail__header mb-3">
      <h4>{{ conversation.subject || t('bt.conversations.no_subject') }}</h4>
      <SyncBadge :item="conversation" />
    </div>
    <slot name="messages">
      <MessageList :messages="messages" :loading="messagesLoading" class="mb-3" />
    </slot>
    <slot name="form">
      <MessageForm @submit="handleSend" />
    </slot>
  </div>
</template>
<script setup>
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import MessageList from './MessageList.vue'
import MessageForm from './MessageForm.vue'
import SyncBadge from '../sync/SyncBadge.vue'
import { useMessages } from '../../composables/useMessages'
import { useAuthStore } from '../../stores/auth'

const { t } = useI18n()

const props = defineProps({
  conversation: { type: Object, default: null },
})

const conversationId = computed(() => props.conversation?.id ?? null)
const { items: messages, loading: messagesLoading, list: listMessages, create: createMessage } = useMessages(conversationId.value)
const authStore = useAuthStore()

watch(conversationId, async (id) => {
  if (id) await listMessages()
}, { immediate: true })

async function handleSend({ content }) {
  if (!content?.trim() || !props.conversation) return
  await createMessage({
    content: content.trim(),
    conversation_id: props.conversation.id,
    author_id: authStore.currentPersonId ?? null,
  })
}
</script>
