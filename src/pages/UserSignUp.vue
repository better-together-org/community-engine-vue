<template>
  <div id="sign-up">
    <section>
      <h2>{{ t('bt.auth.heading_sign_up') }}</h2>
      <BtUserSignUpForm />
      <div><BLink to="/users/sign-in">{{ t('bt.auth.prompt_sign_in') }}</BLink></div>
      <div><BLink to="/users/confirmation/resend">{{ t('bt.auth.prompt_resend_full') }}</BLink></div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { BLink } from 'bootstrap-vue-next'
import BtUserSignUpForm from '../components/BtUserSignUpForm.vue'

const { t } = useI18n()
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #sign-up { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
