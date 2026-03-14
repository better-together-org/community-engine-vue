#!/usr/bin/env node
/**
 * i18n-check-uk.mjs
 *
 * Cross-checks uk.json completeness against en.json:
 *   FAIL  (exit 1): key present in en.json but absent from uk.json
 *   WARN  (exit 0): key present in uk.json but absent from en.json (extra/stale key)
 *
 * Usage:
 *   node scripts/i18n-check-uk.mjs
 */

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const LOCALES = join(ROOT, 'src', 'i18n', 'locales')
const EN_FILE = join(LOCALES, 'en.json')
const UK_FILE = join(LOCALES, 'uk.json')

// ── Flatten JSON to dot-notation keys ────────────────────────────────────────

function flattenKeys(obj, prefix = '') {
  const keys = []
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      keys.push(...flattenKeys(v, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

const enKeys = new Set(flattenKeys(JSON.parse(readFileSync(EN_FILE, 'utf8'))))
const ukKeys = new Set(flattenKeys(JSON.parse(readFileSync(UK_FILE, 'utf8'))))

const missing = [...enKeys].filter((k) => !ukKeys.has(k))   // in en, not in uk → ERROR
const extra   = [...ukKeys].filter((k) => !enKeys.has(k))   // in uk, not in en → WARN

// ── Report ────────────────────────────────────────────────────────────────────

const red    = (s) => `\x1b[31m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const green  = (s) => `\x1b[32m${s}\x1b[0m`
const bold   = (s) => `\x1b[1m${s}\x1b[0m`

console.log(bold('\n── i18n Ukrainian Completeness Check ───────────────────────'))
console.log(`  en.json keys: ${enKeys.size}`)
console.log(`  uk.json keys: ${ukKeys.size}`)
console.log('────────────────────────────────────────────────────────────\n')

let exitCode = 0

if (missing.length > 0) {
  console.error(bold(red(`✖  ${missing.length} MISSING key(s) — in en.json but absent from uk.json:\n`)))
  for (const k of missing) console.error(`   ${red('✖')} ${k}`)
  console.error()
  exitCode = 1
} else {
  console.log(green('✔  No missing Ukrainian translations.\n'))
}

if (extra.length > 0) {
  console.warn(bold(yellow(`⚠  ${extra.length} extra key(s) — in uk.json but absent from en.json:\n`)))
  for (const k of extra) console.warn(`   ${yellow('⚠')} ${k}`)
  console.warn()
} else {
  console.log(green('✔  No extra keys in uk.json.\n'))
}

if (exitCode === 0) {
  console.log(green(bold('✔  Ukrainian translation completeness check passed.\n')))
} else {
  console.error(red(bold('✖  Ukrainian translation completeness check FAILED.\n')))
}

process.exit(exitCode)
