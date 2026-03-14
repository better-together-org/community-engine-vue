<template>
  <div id="sign-up">
    <section>
      <h2>Sign Up</h2>
      <BtUserSignUpForm />
      <div><BLink to="/users/sign-in">Already have an account? Sign in!</BLink></div>
      <div><BLink to="/users/confirmation/resend">Didn't receive your account confirmation email? Resend it!</BLink></div>
    </section>
  </div>
</template>

<script setup>
import { BLink } from 'bootstrap-vue-next'
import BtUserSignUpForm from '../components/BtUserSignUpForm.vue'
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #sign-up { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
