<template>
  <span
    v-if="showBadge"
    class="sync-badge"
    :class="`sync-badge--${resolvedStatus}`"
    :title="label"
    :aria-label="label"
    role="status"
  >
    <span
      v-if="resolvedStatus === 'local'"
      class="sync-dot sync-dot--local"
    />
    <span
      v-else-if="resolvedStatus === 'syncing'"
      class="sync-dot sync-dot--syncing sync-dot--spin"
    />
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <span v-else-if="resolvedStatus === 'conflict'" class="sync-dot sync-dot--conflict">!</span>
    <!-- eslint-disable-next-line @intlify/vue-i18n/no-raw-text -->
    <span v-else-if="resolvedStatus === 'needs-auth'" class="sync-dot sync-dot--needs-auth">🔒</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSyncStatus } from '../../composables/useSyncStatus'

const { t } = useI18n()

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
  status: {
    type: String,
    default: null,
    validator: (v) => ['local', 'syncing', 'synced', 'conflict', 'needs-auth', null].includes(v),
  },
})

const { syncStatus } = useSyncStatus(computed(() => props.item))

// Use directly-passed status prop or derive from item
const resolvedStatus = computed(() => props.status ?? syncStatus.value)

// Only render if there is something to show (synced = invisible)
const showBadge = computed(() => resolvedStatus.value !== 'synced' && resolvedStatus.value !== null)

const label = computed(() => {
  switch (resolvedStatus.value) {
  case 'local': return t('bt.sync.status.local_title')
  case 'syncing': return t('bt.sync.status.syncing')
  case 'conflict': return t('bt.sync.status.conflict')
  case 'needs-auth': return t('bt.sync.status.needs_auth_title')
  default: return ''
  }
})
</script>

<style scoped lang="scss">
@import '../../stylesheets/sync-indicators.scss';

.sync-badge {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  vertical-align: middle;
}

.sync-dot {
  @include sync-dot(transparent);

  &--local {
    background-color: $sync-local;
    animation: sync-pulse 2s ease-in-out infinite;
  }

  &--syncing {
    border: 2px solid $sync-syncing;
    background-color: transparent;
    width: $sync-badge-size;
    height: $sync-badge-size;
    border-radius: 50%;
    border-top-color: transparent;
    animation: sync-spin 0.8s linear infinite;
  }

  &--conflict {
    background-color: $sync-conflict;
    color: white;
    font-size: 6px;
    font-weight: bold;
    width: $sync-badge-size-lg;
    height: $sync-badge-size-lg;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &--needs-auth {
    background-color: transparent;
    font-size: 10px;
  }
}
</style>
