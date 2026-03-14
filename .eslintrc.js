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
  plugins: ['vue'],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['currentState'] }],
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['tests/**/*.js', 'tests/**/*.ts'],
      rules: { 'import/no-unresolved': 'off' },
    },
  ],
}
