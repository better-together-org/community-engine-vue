import { config } from '@vue/test-utils'
import { createCevI18n } from '@/i18n/index.js'
import { RouterLink, RouterView } from 'vue-router'

const i18n = createCevI18n()
config.global.plugins.push(i18n)

// Stub router components globally so tests don't need a full router
config.global.stubs = {
  RouterLink: { template: '<a><slot /></a>' },
  RouterView: true,
}
