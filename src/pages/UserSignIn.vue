<template>
  <div id="sign-in">
    <section>
      <h2>Sign In</h2>
      <BtUserSignInForm />
      <div><BLink to="/users/sign-up">Don't have an account? Sign up!</BLink></div>
      <div><BLink to="/users/password/reset">Forgot your password? Reset it!</BLink></div>
      <div><BLink to="/users/confirmation/resend">Didn't receive confirmation email? Resend it!</BLink></div>
    </section>
  </div>
</template>

<script setup>
import { BLink } from 'bootstrap-vue-next'
import BtUserSignInForm from '../components/BtUserSignInForm.vue'
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #sign-in { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
