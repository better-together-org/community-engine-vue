<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup :label="t('bt.auth.email')" label-for="resend-email">
      <BFormInput
        id="resend-email"
        v-model="email"
        type="email"
        required
        :placeholder="t('bt.auth.email')"
      />
    </BFormGroup>
    <BButton type="submit" variant="primary" class="w-100" :disabled="loading">
      {{ t('bt.auth.send_confirmation_email') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const { t } = useI18n()

const authStore = useAuthStore()
const { toast } = useToaster()
const loading = ref(false)
const email = ref('')

async function handleSubmit() {
  loading.value = true
  try {
    await authStore.resendConfirmation({ user: { email: email.value } })
    toast('Confirmation email sent. Please check your inbox.', 'success')
    email.value = ''
  } catch (err) {
    const msg = err?.response?.data?.error || 'Failed to send confirmation email.'
    toast(msg, 'danger')
  } finally {
    loading.value = false
  }
}
</script>
