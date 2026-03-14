<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup
      :label="t('bt.auth.email')"
      label-for="sign-in-email"
    >
      <BFormInput
        id="sign-in-email"
        v-model="form.user.email"
        type="email"
        required
        :placeholder="t('bt.auth.email')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.auth.password')"
      label-for="sign-in-password"
    >
      <BFormInput
        id="sign-in-password"
        v-model="form.user.password"
        type="password"
        required
        :placeholder="t('bt.auth.password')"
      />
    </BFormGroup>
    <BButton
      type="submit"
      variant="primary"
      class="w-100"
      :disabled="loading"
    >
      {{ t('bt.auth.sign_in') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const { t } = useI18n()

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
