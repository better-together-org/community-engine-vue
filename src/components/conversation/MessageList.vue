<template>
  <div class="bt-message-list">
    <div v-if="loading" class="text-center p-3 text-muted">
      <slot name="loading">{{ t('bt.messages.loading') }}</slot>
    </div>
    <div v-else-if="!messages.length" class="text-center p-3 text-muted">
      <slot name="empty">{{ t('bt.messages.list_empty') }}</slot>
    </div>
    <template v-else>
      <MessageItem
        v-for="message in messages"
        :key="message.id"
        :message="message"
      />
    </template>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n'
import MessageItem from './MessageItem.vue'
const { t } = useI18n()
defineProps({
  messages: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>
<style scoped lang="scss">
.bt-message-list { max-height: 400px; overflow-y: auto; padding: 1rem; border: 1px solid #dee2e6; border-radius: 0.5rem; }
</style>
