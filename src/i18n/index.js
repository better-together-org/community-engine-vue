import { createI18n } from 'vue-i18n'
import en from './locales/en.json'

// Extension messages registered by companion packages before install()
const _extensionMessages = []

/**
 * Register additional locale messages from a companion package.
 * Must be called before CommunityEngineVue is installed.
 *
 * @param {Object} messages - Locale messages object, e.g. { en: { commerce: {...} }, fr: {...} }
 */
export function registerExtensionMessages(messages) {
  _extensionMessages.push(messages)
}

/**
 * Build the merged messages object for a given set of option messages.
 * Merges CEV base (bt.*), extension messages, and host-app overrides.
 */
function buildMessages(optionMessages = {}) {
  const merged = {
    en: { bt: { ...en.bt } },
  }

  // Merge companion package extension messages
  for (const ext of _extensionMessages) {
    for (const [locale, msgs] of Object.entries(ext)) {
      if (!merged[locale]) merged[locale] = {}
      Object.assign(merged[locale], msgs)
    }
  }

  // Merge host-app-provided message overrides (can override bt.* or add new locales)
  for (const [locale, msgs] of Object.entries(optionMessages)) {
    if (!merged[locale]) merged[locale] = {}
    // Deep merge bt.* — allows partial overrides of individual bt keys
    if (msgs.bt) {
      merged[locale].bt = { ...(merged[locale].bt ?? {}), ...msgs.bt }
    }
    // Merge everything else at top level
    const { bt: _, ...rest } = msgs
    Object.assign(merged[locale], rest)
  }

  return merged
}

/**
 * Create a standalone vue-i18n instance with CEV messages.
 * Used when the host app does not have its own vue-i18n instance.
 */
export function createCevI18n(optionMessages = {}) {
  return createI18n({
    legacy: false,       // Composition API mode
    locale: 'en',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: buildMessages(optionMessages),
    // Silence missing key warnings in production — keys fall back to en
    missingWarn: import.meta.env.DEV,
    fallbackWarn: import.meta.env.DEV,
  })
}

/**
 * Install i18n into the Vue app.
 *
 * Strategy:
 * - If the host app already installed vue-i18n (detectable via $i18n on globalProperties),
 *   merge CEV messages into the existing instance instead of installing a new one.
 * - If no i18n instance exists, install a fresh one with CEV messages.
 *
 * @param {import('vue').App} app
 * @param {Object} options - Plugin options (may include options.messages for locale overrides)
 */
export function installI18n(app, options = {}) {
  const existing = app.config.globalProperties.$i18n

  if (existing) {
    // Merge CEV bt.* into the host app's existing i18n instance
    const merged = buildMessages(options.messages ?? {})
    for (const [locale, msgs] of Object.entries(merged)) {
      existing.global.mergeLocaleMessage(locale, msgs)
    }
  } else {
    const i18n = createCevI18n(options.messages ?? {})
    app.use(i18n)
  }
}
