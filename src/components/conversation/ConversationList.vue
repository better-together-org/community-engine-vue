<template>
  <div class="bt-conversation-list">
    <slot name="header" />
    <div v-if="loading" class="bt-conversation-list__loading">
      <slot name="loading"><div class="text-center p-4 text-muted">Loading conversations…</div></slot>
    </div>
    <div v-else-if="!conversations.length" class="bt-conversation-list__empty">
      <slot name="empty"><div class="text-center p-4 text-muted">No conversations yet.</div></slot>
    </div>
    <template v-else>
      <slot
        v-for="(conversation, index) in conversations"
        :key="conversation.id"
        name="item"
        :item="conversation"
        :index="index"
      >
        <ConversationCard
          :conversation="conversation"
          class="mb-3"
          @view="$emit('view', conversation)"
        />
      </slot>
    </template>
    <slot name="footer" />
  </div>
</template>
<script setup>
import ConversationCard from './ConversationCard.vue'
defineProps({
  conversations: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
defineEmits(['view'])
</script>
