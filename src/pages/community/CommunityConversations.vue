<template>
  <div class="bt-community-conversations">
    <h2>{{ t('bt.navigation.conversations') }}</h2>
    <BAlert
      variant="info"
      :model-value="true"
    >
      {{ t('bt.conversations.coming_soon') }}
    </BAlert>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BAlert } from 'bootstrap-vue-next'

const { t } = useI18n()
</script>
