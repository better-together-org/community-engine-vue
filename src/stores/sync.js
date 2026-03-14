import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSyncStore = defineStore('btSync', () => {
  const online = ref(navigator.onLine)
  const pendingCount = ref(0)
  const syncing = ref(false)

  const statusLabel = computed(() => {
    if (!online.value) return 'offline'
    if (syncing.value || pendingCount.value > 0) return 'syncing'
    return 'synced'
  })

  function setOnline(val) {
    online.value = val
  }

  function setPendingCount(n) {
    pendingCount.value = n
  }

  function setSyncing(val) {
    syncing.value = val
  }

  function initNetworkListeners() {
    window.addEventListener('online', () => { online.value = true })
    window.addEventListener('offline', () => { online.value = false })
  }

  return {
    online,
    pendingCount,
    syncing,
    statusLabel,
    setOnline,
    setPendingCount,
    setSyncing,
    initNetworkListeners,
  }
})
