# PWA Setup Guide for Host Apps

This guide shows how to wire up PWA support in a host app (e.g. `better-together-vue`) using the helpers that Community Engine Vue provides.

CEV is a library — it does not register a service worker itself. The host app owns the SW and uses CEV's helpers to configure it correctly.

---

## 1. Install `vite-plugin-pwa`

```bash
yarn add -D vite-plugin-pwa
```

---

## 2. Update `vite.config.js`

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { getCevWorkboxConfig } from '@bettertogether/community-engine-vue'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',

      workbox: {
        // CE API cache + image cache + font cache from CEV
        runtimeCaching: getCevWorkboxConfig(),

        // SPA fallback — serve index.html for all unmatched navigation requests
        navigateFallback: '/index.html',

        // Precache these asset types at SW install time
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },

      manifest: {
        name: 'Better Together',
        short_name: 'BetterTogether',
        description: 'Community platform powered by Better Together Solutions',
        theme_color: '#4f46e5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
```

> **Extending the cache config:** `getCevWorkboxConfig()` returns an array you can spread and extend:
> ```js
> runtimeCaching: [
>   ...getCevWorkboxConfig(),
>   { urlPattern: /\/my-extra-api\/.*/, handler: 'NetworkFirst', options: { ... } },
> ],
> ```

---

## 3. Add a "New Version" Banner (optional but recommended)

In `App.vue` (or a dedicated `SwUpdateBanner.vue`):

```vue
<script setup>
import { useSwUpdate } from '@bettertogether/community-engine-vue'

const { updateAvailable, applyUpdate } = useSwUpdate()
</script>

<template>
  <div v-if="updateAvailable" class="sw-update-banner">
    A new version is available.
    <button @click="applyUpdate">Reload</button>
  </div>
</template>
```

The `sw-updated` DOM event is emitted automatically when vite-plugin-pwa detects a waiting SW. Wire it up by dispatching the event from vite-plugin-pwa's `onNeedRefresh` callback:

```js
// In main.js or a separate pwa.js bootstrap file
import { useRegisterSW } from 'virtual:pwa-register/vue'

useRegisterSW({
  onNeedRefresh() {
    // Let useSwUpdate() know a new SW is waiting
    window.dispatchEvent(new CustomEvent('sw-updated', {
      detail: { registration: navigator.serviceWorker.controller?.registration }
    }))
  },
  onOfflineReady() {
    console.log('[PWA] App ready for offline use')
  },
})
```

---

## 4. Add an Install Prompt (optional)

In any component:

```vue
<script setup>
import { useInstallPrompt } from '@bettertogether/community-engine-vue'

const { canInstall, install, dismiss } = useInstallPrompt()
</script>

<template>
  <div v-if="canInstall" class="install-banner">
    Install Better Together for offline access.
    <button @click="install">Install</button>
    <button @click="dismiss">Not now</button>
  </div>
</template>
```

Once dismissed, the banner will not appear for 30 days.

---

## 5. Background Sync (optional — for closed-tab sync replay)

CEV's `useSyncStore.drainSyncQueue()` handles sync while the tab is open. If you also want mutations queued while offline to be replayed after the tab is closed, use a custom service worker:

### 5a. Tell vite-plugin-pwa to use a custom SW

```js
// vite.config.js
VitePWA({
  strategies: 'injectManifest',  // use your own SW file instead of generateSW
  srcDir: 'src',
  filename: 'sw.js',
  // ... rest of config
})
```

### 5b. Create `src/sw.js`

```js
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'
import { BackgroundSyncPlugin } from 'workbox-background-sync'
import { registerBackgroundSyncRoutes } from '@bettertogether/community-engine-vue/pwa/sw-helpers'

// Precache the app shell (manifest injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST)

// Register CE API mutation routes for background sync
registerBackgroundSyncRoutes({ registerRoute, NetworkOnly, BackgroundSyncPlugin })

// Handle skipWaiting message from useSwUpdate()
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting()
})
```

### 5c. Listen for replay events in the app

```js
// In main.js or a composable
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'ce-bg-sync-replayed') {
      // Refresh pending count in useSyncStore
      useSyncStore().drainSyncQueue()
    }
  })
}
```

---

## 6. Offline UX

CEV's `OfflineBanner` component already shows when the user is offline — no changes needed. Just ensure `initNetworkListeners()` is called once when the app boots:

```js
// main.js or App.vue setup
import { useSyncStore } from '@bettertogether/community-engine-vue'

const syncStore = useSyncStore()
syncStore.initNetworkListeners()
```

---

## Summary of CEV PWA Exports

| Export | Type | Purpose |
|--------|------|---------|
| `getCevWorkboxConfig()` | Function | Workbox `runtimeCaching` entries for CE resources |
| `useInstallPrompt()` | Composable | `beforeinstallprompt` wrapper with 30-day dismiss |
| `useSwUpdate()` | Composable | Detect + apply SW updates via `sw-updated` event |
| `registerBackgroundSyncRoutes` | SW helper | Workbox background sync for CE API mutations (SW context only — import from `…/pwa/sw-helpers`) |
