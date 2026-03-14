import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import BtApp from './BtApp.vue'
import router from './router'
import { setupPlugins } from './plugins'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(BtApp)
app.use(pinia)
app.use(router)
setupPlugins(app)
app.mount('#app')
