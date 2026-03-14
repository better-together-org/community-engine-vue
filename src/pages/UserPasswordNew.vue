<template>
  <div id="new-password">
    <section>
      <h2>{{ t('bt.auth.heading_password_new') }}</h2>
      <BtUserNewPasswordForm :reset-password-token="resetPasswordToken" />
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import BtUserNewPasswordForm from '../components/BtUserNewPasswordForm.vue'

const { t } = useI18n()

defineProps({
  resetPasswordToken: { type: String, default: '' },
})
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #new-password { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
