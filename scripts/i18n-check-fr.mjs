#!/usr/bin/env node
/**
 * i18n-check-fr.mjs
 *
 * Cross-checks fr.json completeness against en.json:
 *   FAIL  (exit 1): key present in en.json but absent from fr.json
 *   WARN  (exit 0): key present in fr.json but absent from en.json (extra/stale key)
 *
 * Usage:
 *   node scripts/i18n-check-fr.mjs
 */

import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..')
const LOCALES = join(ROOT, 'src', 'i18n', 'locales')
const EN_FILE = join(LOCALES, 'en.json')
const FR_FILE = join(LOCALES, 'fr.json')

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
const frKeys = new Set(flattenKeys(JSON.parse(readFileSync(FR_FILE, 'utf8'))))

const missing = [...enKeys].filter((k) => !frKeys.has(k))   // in en, not in fr → ERROR
const extra   = [...frKeys].filter((k) => !enKeys.has(k))   // in fr, not in en → WARN

// ── Report ────────────────────────────────────────────────────────────────────

const red    = (s) => `\x1b[31m${s}\x1b[0m`
const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const green  = (s) => `\x1b[32m${s}\x1b[0m`
const bold   = (s) => `\x1b[1m${s}\x1b[0m`

console.log(bold('\n── i18n French Completeness Check ──────────────────────────'))
console.log(`  en.json keys: ${enKeys.size}`)
console.log(`  fr.json keys: ${frKeys.size}`)
console.log('────────────────────────────────────────────────────────────\n')

let exitCode = 0

if (missing.length > 0) {
  console.error(bold(red(`✖  ${missing.length} MISSING key(s) — in en.json but absent from fr.json:\n`)))
  for (const k of missing) console.error(`   ${red('✖')} ${k}`)
  console.error()
  exitCode = 1
} else {
  console.log(green('✔  No missing French translations.\n'))
}

if (extra.length > 0) {
  console.warn(bold(yellow(`⚠  ${extra.length} extra key(s) — in fr.json but absent from en.json:\n`)))
  for (const k of extra) console.warn(`   ${yellow('⚠')} ${k}`)
  console.warn()
} else {
  console.log(green('✔  No extra keys in fr.json.\n'))
}

if (exitCode === 0) {
  console.log(green(bold('✔  French translation completeness check passed.\n')))
} else {
  console.error(red(bold('✖  French translation completeness check FAILED.\n')))
}

process.exit(exitCode)
