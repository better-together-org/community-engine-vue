<template>
  <div id="reset-password">
    <section>
      <h2>{{ t('bt.auth.heading_password_reset') }}</h2>
      <BtUserResetPasswordForm />
      <div>
        <BLink to="/users/sign-in">
          {{ t('bt.auth.prompt_remembered_password') }}
        </BLink>
      </div>
      <div>
        <BLink to="/users/sign-up">
          {{ t('bt.auth.prompt_sign_up') }}
        </BLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BLink } from 'bootstrap-vue-next'
import BtUserResetPasswordForm from '../components/BtUserResetPasswordForm.vue'

const { t } = useI18n()
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #reset-password { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
