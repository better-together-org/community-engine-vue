import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import BtApp from './BtApp.vue'
import router from './router'
import { setupPlugins } from './plugins'
import { useSyncStore } from './stores/sync'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(BtApp)
app.use(pinia)
app.use(router)
setupPlugins(app)
app.mount('#app')

// Initialize network listeners after mount (store is accessible after pinia is installed)
const syncStore = useSyncStore()
syncStore.initNetworkListeners()
