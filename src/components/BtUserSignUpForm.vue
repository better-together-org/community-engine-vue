<template>
  <BForm @submit.prevent="handleSubmit">
    <fieldset>
      <legend>Login Info</legend>
      <BFormGroup label="Email *" label-for="sign-up-email">
        <BFormInput id="sign-up-email" v-model="form.user.email" type="email" required placeholder="Your email address" />
      </BFormGroup>
      <BFormGroup label="Password *" label-for="sign-up-password">
        <BFormInput id="sign-up-password" v-model="form.user.password" type="password" required minlength="12" placeholder="Your password" />
        <BFormText>Should be a short phrase. Minimum 12 characters.</BFormText>
      </BFormGroup>
    </fieldset>
    <fieldset>
      <legend>Personal Info</legend>
      <BFormGroup label="Name *" label-for="sign-up-name">
        <BFormInput id="sign-up-name" v-model="form.user.person_attributes.name" type="text" required placeholder="Your name" />
      </BFormGroup>
      <BFormGroup label="Description *" label-for="sign-up-description">
        <BFormTextarea id="sign-up-description" v-model="form.user.person_attributes.description" required placeholder="Your description" rows="3" />
      </BFormGroup>
    </fieldset>
    <BButton type="submit" variant="primary" class="w-100" :disabled="loading">Sign Up</BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormText, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const authStore = useAuthStore()
const router = useRouter()
const { toast } = useToaster()
const loading = ref(false)

const form = reactive({ user: { email: '', password: '', person_attributes: { name: '', description: '' } } })

async function handleSubmit() {
  loading.value = true
  try {
    await authStore.signUp(form.user)
    await router.push('/users/sign-in')
    toast('Please check your email to confirm your account.', 'success')
  } catch (err) {
    const msg = err?.response?.data?.error || 'Sign up failed. Please try again.'
    toast(msg, 'danger')
  } finally {
    loading.value = false
  }
}
</script>
