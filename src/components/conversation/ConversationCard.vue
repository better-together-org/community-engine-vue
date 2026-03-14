<template>
  <BCard class="bt-conversation-card">
    <BCardBody>
      <slot name="title">
        <div class="d-flex align-items-start justify-content-between gap-2 mb-1">
          <h5 class="bt-conversation-card__subject mb-0">{{ conversation.subject || 'No subject' }}</h5>
          <slot name="sync-badge"><SyncBadge :item="conversation" /></slot>
        </div>
      </slot>
      <slot name="meta">
        <small class="text-muted">{{ memberCount }} participant{{ memberCount !== 1 ? 's' : '' }}</small>
      </slot>
      <slot name="body" />
    </BCardBody>
    <template #footer>
      <slot name="footer">
        <div class="bt-conversation-card__actions d-flex align-items-center gap-2">
          <BButton variant="outline-primary" size="sm" @click="$emit('view', conversation)">Open</BButton>
          <ExtensionSlot target="ConversationCard" slot="footer" :context="{ item: conversation }" />
        </div>
      </slot>
    </template>
  </BCard>
</template>
<script setup>
import { computed } from 'vue'
import { BCard, BCardBody, BButton } from 'bootstrap-vue-next'
import SyncBadge from '../sync/SyncBadge.vue'
import ExtensionSlot from '../shared/ExtensionSlot.vue'
const props = defineProps({ conversation: { type: Object, required: true } })
defineEmits(['view'])
const memberCount = computed(() => props.conversation.member_count ?? 0)
</script>
