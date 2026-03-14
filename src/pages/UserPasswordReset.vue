<template>
  <div id="reset-password">
    <section>
      <h2>Reset Your Password</h2>
      <BtUserResetPasswordForm />
      <div><BLink to="/users/sign-in">Remembered your password? Sign in!</BLink></div>
      <div><BLink to="/users/sign-up">Don't have an account? Sign up!</BLink></div>
    </section>
  </div>
</template>

<script setup>
import { BLink } from 'bootstrap-vue-next'
import BtUserResetPasswordForm from '../components/BtUserResetPasswordForm.vue'
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #reset-password { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
