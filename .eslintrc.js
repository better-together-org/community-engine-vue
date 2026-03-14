module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['vue', '@intlify/vue-i18n'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['currentState'] }],
    'vue/multi-word-component-names': 'off',
    // Stage 0: warn only — strings not yet extracted. Will become 'error' in Stage 1.
    '@intlify/vue-i18n/no-raw-text': 'warn',
  },
  settings: {
    'vue-i18n': {
      localeDir: './src/i18n/locales/*.json',
      messageSyntaxVersion: '^9.0.0',
    },
  },
  overrides: [
    {
      files: ['tests/**/*.js', 'tests/**/*.ts'],
      rules: { 'import/no-unresolved': 'off' },
    },
  ],
}
