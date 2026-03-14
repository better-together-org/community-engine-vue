<template>
  <Transition name="banner-fade">
    <BAlert
      v-if="show"
      variant="warning"
      class="offline-banner"
      :model-value="true"
      dismissible
      @dismissed="dismiss"
    >
      <strong>You are offline.</strong>
      Any changes you make will be saved locally and synced when you reconnect.
    </BAlert>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { BAlert } from 'bootstrap-vue-next'
import { useSyncStore } from '../../stores/sync'

const syncStore = useSyncStore()
const dismissed = ref(false)

const show = computed(() => !syncStore.online && !dismissed.value)

watch(() => syncStore.online, (isOnline) => {
  if (isOnline) dismissed.value = false
})

function dismiss() {
  dismissed.value = true
}
</script>

<style scoped lang="scss">
.offline-banner {
  margin: 0;
  border-radius: 0;
  border-left: none;
  border-right: none;
}

.banner-fade-enter-active,
.banner-fade-leave-active { transition: opacity 0.3s; }
.banner-fade-enter-from,
.banner-fade-leave-to { opacity: 0; }
</style>
