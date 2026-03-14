<template>
  <section id="error-404">
    <div class="row heading mb-3">
      <div class="col-md">
        <h2 class="mb-4">{{ t('bt.errors.not_found_heading') }}</h2>
        <p>{{ t('bt.errors.not_found_message') }}</p>
        <div class="text-center mt-4">
          <RouterLink
            to="/"
            :title="t('bt.app.name')"
            class="btn btn-primary card-action"
          >
            {{ t('bt.errors.visit_home') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<style lang="scss">
</style>
