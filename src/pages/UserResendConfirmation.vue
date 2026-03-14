<template>
  <div id="resend-confirmation">
    <section>
      <h2>{{ t('bt.auth.heading_resend_confirmation') }}</h2>
      <BtUserResendConfirmationForm />
      <div>
        <BLink to="/users/sign-in">
          {{ t('bt.auth.prompt_confirmed') }}
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
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BLink } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'
import BtUserResendConfirmationForm from '../components/BtUserResendConfirmationForm.vue'

const { t } = useI18n()

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
