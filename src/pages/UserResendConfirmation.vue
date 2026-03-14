<template>
  <div id="resend-confirmation">
    <section>
      <h2>Resend your confirmation email</h2>
      <BtUserResendConfirmationForm />
      <div><BLink to="/users/sign-in">Already confirmed? Sign in!</BLink></div>
      <div><BLink to="/users/sign-up">Don't have an account? Sign up!</BLink></div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BLink } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'
import BtUserResendConfirmationForm from '../components/BtUserResendConfirmationForm.vue'

const props = defineProps({
  confirmationToken: { type: String, default: null },
})

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToaster()

onMounted(async () => {
  if (!props.confirmationToken) return
  try {
    await authStore.sendConfirmation({ confirmation_token: props.confirmationToken })
    await router.push('/users/sign-in')
    toast('Your account is confirmed. You can now sign in.', 'info')
  } catch (err) {
    const resp = err?.response?.data || {}
    const field = resp.confirmation_token ? 'Confirmation Token' : resp.email ? 'Email' : ''
    const errors = (resp.confirmation_token || resp.email || ['There was an error']).join(', ')
    toast(`${field} ${errors}`, 'danger', { title: 'Confirmation Error', autoHideDelay: 6000 })
  }
})
</script>

<style scoped lang="scss">
@media (min-width: 992px) {
  #resend-confirmation { width: 50vw; margin: auto; section { padding: 10%; } }
}
</style>
