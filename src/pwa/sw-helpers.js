/**
 * sw-helpers.js — Service Worker context helpers for Community Engine host apps.
 *
 * Import this file from your host app's custom service worker entry point
 * (e.g. `src/sw.js`) alongside vite-plugin-pwa's Workbox integration.
 *
 * ⚠️  This file runs INSIDE the service worker — do NOT import Vue or any
 *     browser-DOM API here.  Only Web Worker / Workbox globals are available.
 *
 * Usage in host app sw.js:
 *   import { registerBackgroundSyncRoutes } from '@bettertogether/community-engine-vue/pwa/sw-helpers'
 *   import { precacheAndRoute } from 'workbox-precaching'
 *   import { registerRoute }    from 'workbox-routing'
 *
 *   precacheAndRoute(self.__WB_MANIFEST)
 *   registerBackgroundSyncRoutes({ registerRoute })
 */

/**
 * registerBackgroundSyncRoutes({ registerRoute })
 *
 * Registers Workbox routes that queue failed CE API mutation requests
 * (POST / PATCH / DELETE to /bt/api/*) into a BackgroundSync queue.
 * When the browser reconnects — even if the tab is closed — the browser
 * replays the queued requests automatically via the Background Sync API.
 *
 * This complements CEV's `drainSyncQueue()` (which runs while the tab is open)
 * by handling the closed-tab / connectivity-lost scenario.
 *
 * @param {object} workboxModules
 * @param {Function} workboxModules.registerRoute - workbox-routing registerRoute
 * @param {Function} [workboxModules.NetworkOnly]  - workbox-strategies NetworkOnly (loaded lazily if omitted)
 * @param {Function} [workboxModules.BackgroundSyncPlugin] - workbox-background-sync BackgroundSyncPlugin
 */
export function registerBackgroundSyncRoutes({
  registerRoute,
  NetworkOnly,
  BackgroundSyncPlugin,
}) {
  // Allow host apps to pass in pre-imported Workbox classes, or fall back to
  // dynamic require() in SW context (works with Workbox's module bundling).
  const NetworkOnlyStrategy = NetworkOnly ?? (() => {
    // eslint-disable-next-line no-undef
    const { NetworkOnly: NO } = require('workbox-strategies')
    return NO
  })()

  const BgSyncPlugin = BackgroundSyncPlugin ?? (() => {
    // eslint-disable-next-line no-undef
    const { BackgroundSyncPlugin: BSP } = require('workbox-background-sync')
    return BSP
  })()

  const bgSyncPlugin = new BgSyncPlugin('ce-api-mutation-queue', {
    maxRetentionTime: 24 * 60, // Retry for up to 24 hours (in minutes)
    onSync: async ({ queue }) => {
      // Replay all queued requests; broadcast result to open tabs
      let entry
      while ((entry = await queue.shiftRequest())) {
        try {
          await fetch(entry.request)
          broadcastSyncEvent('ce-bg-sync-replayed', { url: entry.request.url })
        } catch {
          await queue.unshiftRequest(entry)
          broadcastSyncEvent('ce-bg-sync-failed', { url: entry.request.url })
          throw new Error('Background sync replay failed — will retry')
        }
      }
    },
  })

  // Queue POST / PATCH / DELETE to CE API (excluding auth routes)
  registerRoute(
    ({ url, request }) =>
      /\/bt\/api\/(?!auth\/)/.test(url.pathname) &&
      ['POST', 'PATCH', 'DELETE'].includes(request.method),
    new NetworkOnlyStrategy({ plugins: [bgSyncPlugin] }),
    'POST',
  )

  registerRoute(
    ({ url, request }) =>
      /\/bt\/api\/(?!auth\/)/.test(url.pathname) &&
      ['POST', 'PATCH', 'DELETE'].includes(request.method),
    new NetworkOnlyStrategy({ plugins: [bgSyncPlugin] }),
    'PATCH',
  )

  registerRoute(
    ({ url, request }) =>
      /\/bt\/api\/(?!auth\/)/.test(url.pathname) &&
      ['POST', 'PATCH', 'DELETE'].includes(request.method),
    new NetworkOnlyStrategy({ plugins: [bgSyncPlugin] }),
    'DELETE',
  )
}

/**
 * broadcastSyncEvent(type, detail)
 *
 * Posts a message to all controlled tabs so the app can react to background
 * sync replay events (e.g. re-run drainSyncQueue to refresh the pending count).
 *
 * @param {string} type   - event type string forwarded as `data.type`
 * @param {object} detail - arbitrary payload
 */
export function broadcastSyncEvent(type, detail = {}) {
  // self.clients is only available in SW context
  if (typeof self === 'undefined' || !self.clients) return
  self.clients.matchAll({ includeUncontrolled: false, type: 'window' }).then((clients) => {
    clients.forEach((client) => client.postMessage({ type, ...detail }))
  })
}

/**
 * dispatchSwUpdatedEvent(registration)
 *
 * Call this from your SW update handler to emit the `sw-updated` DOM event
 * that CEV's `useSwUpdate()` composable listens for.
 *
 * Typically wired up in vite-plugin-pwa's `onRegisteredSW` / `onNeedRefresh`
 * callback in the host app rather than in the SW file itself, but provided
 * here for completeness.
 *
 * @param {ServiceWorkerRegistration} registration
 */
export function dispatchSwUpdatedEvent(registration) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('sw-updated', { detail: { registration } }))
}
