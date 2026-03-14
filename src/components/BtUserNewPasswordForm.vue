<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup label="New Password *" label-for="new-password">
      <BFormInput id="new-password" v-model="password" type="password" required minlength="12" placeholder="Your new password" />
      <BFormText>Minimum 12 characters.</BFormText>
    </BFormGroup>
    <BButton type="submit" variant="primary" class="w-100" :disabled="loading">Change Password</BButton>
  </BForm>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BFormText, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const props = defineProps({
  resetPasswordToken: { type: String, default: '' },
})

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToaster()
const loading = ref(false)
const password = ref('')

async function handleSubmit() {
  loading.value = true
  try {
    await authStore.newPassword({ user: { reset_password_token: props.resetPasswordToken, password: password.value } })
    await router.push('/users/sign-in')
    toast('Password changed. You can now sign in.', 'success')
  } catch (err) {
    const msg = err?.response?.data?.error || 'Failed to change password.'
    toast(msg, 'danger')
  } finally {
    loading.value = false
  }
}
</script>
