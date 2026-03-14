<template>
  <div id="home">
    <section id="introduction">
      <div class="col">
        <h1>{{ t('bt.app.home_heading') }}</h1>
        <p>{{ t('bt.app.home_tagline') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped lang="scss">
h2 {
  margin-bottom: 1.5rem;
}
</style>
