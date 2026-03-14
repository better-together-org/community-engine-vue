<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup label="Email" label-for="sign-in-email">
      <BFormInput id="sign-in-email" v-model="form.user.email" type="email" required placeholder="Your email address" />
    </BFormGroup>
    <BFormGroup label="Password" label-for="sign-in-password">
      <BFormInput id="sign-in-password" v-model="form.user.password" type="password" required placeholder="Your password" />
    </BFormGroup>
    <BButton type="submit" variant="primary" class="w-100" :disabled="loading">Sign In</BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToaster()
const loading = ref(false)

const form = reactive({ user: { email: '', password: '' } })

async function handleSubmit() {
  loading.value = true
  try {
    await authStore.signIn(form.user)
    await router.push('/me')
    toast('Welcome back!', 'success')
  } catch (err) {
    const msg = err?.response?.data?.error || 'Sign in failed. Please check your credentials.'
    toast(msg, 'danger')
  } finally {
    loading.value = false
  }
}
</script>
