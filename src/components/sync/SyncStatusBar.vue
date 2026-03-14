<template>
  <Transition name="sync-bar-fade">
    <div
      v-if="showBar"
      class="sync-status-bar"
      :class="barClass"
      role="status"
      :aria-live="syncStore.online ? 'polite' : 'assertive'"
    >
      <span class="sync-status-bar__icon">
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <span v-if="!syncStore.online">⚡</span>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <span v-else-if="syncStore.syncing" class="sync-spin-icon">↻</span>
        <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
        <span v-else>↻</span>
      </span>
      <span class="sync-status-bar__text">{{ statusText }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSyncStore } from '../../stores/sync'

const { t } = useI18n()
const syncStore = useSyncStore()

const showBar = computed(
  () => !syncStore.online || syncStore.syncing || syncStore.pendingCount > 0,
)

const barClass = computed(() => ({
  'sync-status-bar--offline': !syncStore.online,
  'sync-status-bar--syncing': syncStore.online && (syncStore.syncing || syncStore.pendingCount > 0),
}))

const statusText = computed(() => {
  if (!syncStore.online) {
    const n = syncStore.pendingCount
    return n > 0
      ? `${t('bt.sync.status_bar_offline')} — ${t('bt.sync.pending_count', n)}`
      : t('bt.sync.status_bar_offline')
  }
  if (syncStore.syncing || syncStore.pendingCount > 0) {
    return t('bt.sync.pending_count', syncStore.pendingCount)
  }
  return ''
})
</script>

<style scoped lang="scss">
@import '../../stylesheets/sync-indicators.scss';

.sync-status-bar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  transition: background-color 0.3s;

  &--offline {
    background-color: $sync-local;
    color: #1a1a1a;
    height: $sync-bar-height-offline;
  }

  &--syncing {
    background-color: $sync-syncing;
    color: white;
    height: $sync-bar-height-offline;
  }

  &__icon {
    font-size: 1rem;
    line-height: 1;
  }
}

.sync-spin-icon {
  display: inline-block;
  animation: sync-spin 1s linear infinite;
}

.sync-bar-fade-enter-active,
.sync-bar-fade-leave-active {
  transition: opacity 0.3s, max-height 0.3s;
  max-height: 40px;
}

.sync-bar-fade-enter-from,
.sync-bar-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
