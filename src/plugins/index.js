import { setupBootstrapVue } from './bootstrap-vue'
import { setupFontAwesome } from './font-awesome'
import { setupProgress } from './progress'

export function setupPlugins(app) {
  setupBootstrapVue(app)
  setupFontAwesome(app)
  setupProgress()
}
