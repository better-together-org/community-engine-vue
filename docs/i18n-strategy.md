# Internationalization (i18n) Strategy

## Overview

`community-engine-vue` uses [vue-i18n v9](https://vue-i18n.intlify.dev/) (Composition API mode) as its localization framework, mirroring the CE Rails engine's locale structure. All user-facing strings are namespaced under the `bt.*` key prefix to avoid collisions with host applications.

**Supported locales** (matching CE Rails): `en` (source), `fr` (French CA — priority), `es`, `uk`

---

## Key Hierarchy

All CEV strings live under the `bt` namespace:

```
bt.
  actions.*          — Generic actions: view, edit, delete, save, cancel, send, create, close
  auth.*             — Sign in/out/up, password, confirmation
  sync.*             — Sync status labels, offline banner, pending count
  errors.*           — Generic error messages, network errors
  offline.*          — Offline mode messages
  navigation.*       — Nav labels
  communities.*      — Community list, empty states, loading
  posts.*            — Post list, form labels, empty states
  events.*           — Event list, form labels, empty states
  conversations.*    — Conversation list, message thread
  messages.*         — Message form, empty thread
  invitations.*      — Invitation card, form, status labels
  pages.*            — CMS page list/detail
  joatu.*            — JoaTU time-banking: offers, requests, agreements
  person.*           — Person card, member list, profile
```

Host applications and companion packages add their own top-level keys (never `bt.*`):
- `bts.*` — better-together-vue (BTS marketing site)
- `commerce.*` — community-commerce-vue
- (host app) — any key outside `bt.*`

---

## Architecture

### Plugin Installation

CEV's `install()` hook checks whether the host application has already installed vue-i18n. If so, it merges CEV messages into the existing instance rather than creating a new one. This prevents double-installation when the host app also uses vue-i18n.

```js
// In your host app:
import { createI18n } from 'vue-i18n'
import CommunityEngineVue from '@bettertogether/community-engine-vue'

const i18n = createI18n({ locale: 'en', messages: { en: { /* your strings */ } } })
app.use(i18n)           // install first
app.use(CommunityEngineVue, {
  messages: {           // optional — extend CEV's bt.* translations
    fr: { bt: { actions: { view: 'Voir' } } }
  }
})
// CEV detects the existing i18n instance and merges bt.* into it
```

If no i18n instance exists, CEV installs its own with English as the default.

### Extending from Companion Packages

Companion packages (e.g. `community-commerce-vue`) register their strings via `registerExtensionMessages()` before the plugin installs:

```js
import { registerExtensionMessages } from '@bettertogether/community-engine-vue'

registerExtensionMessages({
  en: { commerce: { checkout: { title: 'Checkout' } } },
  fr: { commerce: { checkout: { title: 'Passer à la caisse' } } },
})
```

These are merged in during `installI18n()`.

### Using Translations in Components

```vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <p>{{ t('bt.communities.list_empty') }}</p>
  <BButton>{{ t('bt.actions.view') }}</BButton>
</template>
```

CEV also re-exports `useI18n` from `vue-i18n` for convenience:
```js
import { useI18n } from '@bettertogether/community-engine-vue'
```

---

## Migration Stages

### Stage 0 — Foundation ✅ (current)

**Goal**: Infrastructure in place. No strings extracted yet. Advisory linting only.

- [x] `vue-i18n@9` installed in CEV
- [x] `src/i18n/index.js` — `createCevI18n()` + `installI18n()` + `registerExtensionMessages()`
- [x] `src/i18n/locales/en.json` — full `bt.*` key skeleton (English only, all strings)
- [x] `@intlify/eslint-plugin-vue-i18n` installed, `no-raw-text: warn` (advisory)
- [x] `scripts/i18n-check.mjs` — missing key check (exit 1) + unused key report
- [x] `yarn i18n:check` npm script
- [x] CI `i18n-health` job added (`continue-on-error: true` — advisory until Stage 2)

**Policy**: New components SHOULD use `t()` but are not yet blocked.

---

### Stage 1 — Audit + Extraction (next sprint)

**Goal**: Zero hardcoded strings in all existing components. CI becomes blocking.

- [ ] Audit all `src/components/**/*.vue` and `src/pages/**/*.vue`
- [ ] Replace ~150–200 hardcoded strings with `t(key)` calls
- [ ] All keys present in `en.json`
- [ ] ESLint `no-raw-text` upgraded from `warn` → `error`
- [ ] CI `i18n-health` job: `continue-on-error: false` (blocking)
- [ ] Script/test coupling: any new `.vue` file without `t()` that has visible text = lint error

**Estimated string count by category**:
| Category | Est. strings |
|----------|-------------|
| Sync indicators | 8 |
| Auth forms | 15 |
| Navigation | 8 |
| Communities | 10 |
| Posts | 10 |
| Events | 8 |
| Conversations/Messages | 12 |
| Invitations | 8 |
| Pages (CMS) | 6 |
| JoaTU | 20 |
| Common actions | 10 |
| Error messages | 10 |
| **Total** | **~125** |

---

### Stage 2 — French CA (`fr.json`) (priority)

**Goal**: Full French Canadian translation for all `bt.*` strings.

BTS operates in Corner Brook, NL — a bilingual region. French CA is the first non-English locale.

- [ ] `src/i18n/locales/fr.json` — translate all `bt.*` keys
- [ ] Priority order: sync indicators → auth → nav → common actions → empty states → forms
- [ ] `BLanguageSwitcher` component — dropdown in `BtNavBar`
- [ ] Locale persisted in Pinia auth store (not PGlite — user preference only)
- [ ] Coordinate with CE Rails `fr.yml` for consistent terminology

Translation notes:
- Use "vous" (formal) for UI — community context is professional-adjacent
- "Synchronisé" for synced, "Hors ligne" for offline
- "Temps-crédit" for time credits (JoaTU)

---

### Stage 3 — Spanish + Ukrainian (`es.json`, `uk.json`)

**Goal**: Match CE Rails' locale support.

- [ ] `es.json` — coordinate with CE Rails `es.yml`
- [ ] `uk.json` — coordinate with CE Rails `uk.yml`
- [ ] CE Rails Translation Agent Instructions pattern applies here too

---

### Stage 4 — RTL + Advanced (deferred)

- RTL layout support (`dir="rtl"`) for Arabic/Hebrew
- Number + date formatting per locale
- Pluralization rules for Slavic locales (Ukrainian)

---

## CI Job: `i18n-health`

Located in `.github/workflows/ci.yml`, runs after lint and unit tests.

**Stage 0** (advisory):
```yaml
- name: i18n health check
  run: yarn i18n:check
  continue-on-error: true
```

**Stage 2** (blocking — after all strings extracted):
```yaml
- name: i18n health check
  run: yarn i18n:check
  # no continue-on-error
```

### What `yarn i18n:check` does

Script: `scripts/i18n-check.mjs`

1. Scans `src/**/*.vue` and `src/**/*.js` for `t('key')` and `$t('key')` references
2. Reads `src/i18n/locales/en.json`, flattens to dot-notation keys
3. **FAIL** (exit 1): any key referenced in code but absent from `en.json`
4. **WARN** (exit 0): any key in `en.json` not referenced in code

Running locally:
```bash
yarn i18n:check          # check for missing/unused keys
yarn i18n:check --strict # also fail on unused keys
```

---

## Translation Agent Instructions

When contributing translations to locale files:

1. **Never modify** `en.json` structure — only add/update values in `fr.json`, `es.json`, `uk.json`
2. **Preserve interpolation** — `{count}`, `{name}` placeholders must appear in translations
3. **Preserve pluralization pipes** — `"no items | one item | {count} items"` (vue-i18n pipe syntax)
4. **Namespace strictly** — all CEV keys start with `bt.`; never add top-level keys to CEV locale files
5. **Consistency with CE Rails** — check `config/locales/{locale}.yml` for established terminology
6. **Cultural appropriateness** — formal register ("vous") for FR, research proper terms for ES/UK

Checking translation completeness:
```bash
yarn i18n:check           # missing keys = strings used in code without translations
```

---

## BTV i18n

`better-together-vue` is a host application. It:
1. Installs CEV (which provides `bt.*` translations)
2. Adds its own strings under `bts.*` using its own i18n instance or extending CEV's

BTV locale files: `src/i18n/locales/en.json` (key: `bts.*`).

BTV page content (About, Opportunities, etc.) is long-form prose — defer translation until Stage 2/3 when infrastructure is confirmed stable.
