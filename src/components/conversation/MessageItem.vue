<template>
  <div class="bt-message-item d-flex gap-2 mb-2">
    <div class="bt-message-item__avatar">
      <div class="bt-message-item__avatar-circle">
        {{ initials }}
      </div>
    </div>
    <div class="bt-message-item__body flex-grow-1">
      <div class="d-flex align-items-center gap-2 mb-1">
        <span class="bt-message-item__author fw-semibold">{{ message.author_name || t('bt.messages.author_unknown') }}</span>
        <small class="text-muted">{{ formattedTime }}</small>
        <SyncBadge :item="message" />
      </div>
      <div class="bt-message-item__content">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SyncBadge from '../sync/SyncBadge.vue'
const { t } = useI18n()
const props = defineProps({ message: { type: Object, required: true } })
const initials = computed(() => {
  const name = props.message.author_name || '?'
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
})
const formattedTime = computed(() => {
  if (!props.message._local_updated) return ''
  return new Date(props.message._local_updated).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
})
</script>
<style scoped lang="scss">
.bt-message-item__avatar-circle {
  width: 32px; height: 32px; border-radius: 50%;
  background: #6c757d; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 600;
}
.bt-message-item__content { font-size: 0.9rem; }
</style>
