import { config } from '@vue/test-utils'
import { createCevI18n } from '@/i18n/index.js'

const i18n = createCevI18n()
config.global.plugins.push(i18n)
