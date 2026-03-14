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
      {{ t('bt.sync.offline_banner') }}
    </BAlert>
  </Transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BAlert } from 'bootstrap-vue-next'
import { useSyncStore } from '../../stores/sync'

const { t } = useI18n()
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
