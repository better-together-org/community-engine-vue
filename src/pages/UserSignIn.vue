<template>
  <div id="sign-in">
    <section>
      <h2>{{ t('bt.auth.heading_sign_in') }}</h2>
      <BtUserSignInForm />
      <div>
        <BLink to="/users/sign-up">
          {{ t('bt.auth.prompt_sign_up') }}
        </BLink>
      </div>
      <div>
        <BLink to="/users/password/reset">
          {{ t('bt.auth.prompt_forgot_password') }}
        </BLink>
      </div>
      <div>
        <BLink to="/users/confirmation/resend">
          {{ t('bt.auth.prompt_resend') }}
        </BLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BLink } from 'bootstrap-vue-next'
import BtUserSignInForm from '../components/BtUserSignInForm.vue'

const { t } = useI18n()
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #sign-in { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
