<template>
  <div id="new-password">
    <section>
      <h2>Create a New Password</h2>
      <BtUserNewPasswordForm :reset-password-token="resetPasswordToken" />
    </section>
  </div>
</template>

<script setup>
import BtUserNewPasswordForm from '../components/BtUserNewPasswordForm.vue'

defineProps({
  resetPasswordToken: { type: String, default: '' },
})
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #new-password { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
