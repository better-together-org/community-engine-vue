import { ref, onMounted, onUnmounted } from 'vue'

const DISMISS_KEY = 'cev_install_prompt_dismissed_until'
const DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

/**
 * useInstallPrompt
 *
 * Wraps the `beforeinstallprompt` browser event so host apps can show their own
 * install UI without duplicating event-handling logic.
 *
 * Returns:
 *   canInstall  — true when a deferred prompt is available AND not recently dismissed
 *   install()   — triggers the native install prompt; resolves with { outcome }
 *   dismiss()   — hides the prompt for 30 days (stored in localStorage)
 */
export function useInstallPrompt() {
  const canInstall = ref(false)
  let deferredPrompt = null

  function isDismissed() {
    if (typeof window === 'undefined') return false
    const until = localStorage.getItem(DISMISS_KEY)
    return until ? Date.now() < Number(until) : false
  }

  function onBeforeInstallPrompt(e) {
    e.preventDefault()
    deferredPrompt = e
    canInstall.value = !isDismissed()
  }

  async function install() {
    if (!deferredPrompt) return { outcome: 'dismissed' }
    deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    deferredPrompt = null
    canInstall.value = false
    return choice
  }

  function dismiss() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DURATION_MS))
    }
    canInstall.value = false
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  })

  return { canInstall, install, dismiss }
}

/**
 * useSwUpdate
 *
 * Listens for the `sw-updated` custom event dispatched by the service worker
 * (via the SW message channel or vite-plugin-pwa's built-in hook) and exposes
 * a reactive flag plus an `applyUpdate()` helper to skip waiting and reload.
 *
 * Returns:
 *   updateAvailable — true when a new SW version is waiting to activate
 *   applyUpdate()   — tells the waiting SW to skip waiting, then reloads the page
 */
export function useSwUpdate() {
  const updateAvailable = ref(false)
  let registration = null

  function onSwUpdated(e) {
    registration = e.detail?.registration ?? null
    updateAvailable.value = true
  }

  function applyUpdate() {
    if (!updateAvailable.value) return
    const sw = registration?.waiting
    if (sw) {
      sw.postMessage({ type: 'SKIP_WAITING' })
    }
    // Reload after a short tick so the new SW has time to claim clients
    window.location.reload()
  }

  onMounted(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return
    window.addEventListener('sw-updated', onSwUpdated)
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('sw-updated', onSwUpdated)
  })

  return { updateAvailable, applyUpdate }
}

/**
 * getCevWorkboxConfig
 *
 * Returns an array of Workbox `runtimeCaching` entries recommended for
 * Community Engine host apps.  Spread (or merge) this into the `workbox`
 * option of vite-plugin-pwa's `VitePWA()` call in the host app's vite.config.js.
 *
 * Covered routes:
 *   - /bt/api/* (excluding /bt/api/auth/*) → NetworkFirst, 5s timeout, 24h TTL
 *   - Images / uploads                     → CacheFirst, 100 entries, 7-day TTL
 *   - Web fonts                            → StaleWhileRevalidate
 *
 * NOT cached (by design):
 *   - /bt/api/auth/* — always network-only (auth tokens must never be cached)
 *   - idb:// — PGlite IndexedDB (never touches the network layer)
 */
export function getCevWorkboxConfig() {
  return [
    {
      // CE Rails JSON:API — skip auth routes
      urlPattern: /\/bt\/api\/(?!auth\/).*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'ce-api-cache',
        networkTimeoutSeconds: 5,
        expiration: { maxAgeSeconds: 60 * 60 * 24 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Images and user uploads
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'ce-image-cache',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
    {
      // Web fonts — serve cached immediately, refresh in background
      urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'ce-font-cache',
        expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
        cacheableResponse: { statuses: [0, 200] },
      },
    },
  ]
}
