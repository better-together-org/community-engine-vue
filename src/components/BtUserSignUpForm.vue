<template>
  <BForm @submit.prevent="handleSubmit">
    <fieldset>
      <legend>{{ t('bt.auth.login_info') }}</legend>
      <BFormGroup :label="t('bt.auth.email')" label-for="sign-up-email">
        <BFormInput
          id="sign-up-email"
          v-model="form.user.email"
          type="email"
          required
          :placeholder="t('bt.auth.email')"
        />
      </BFormGroup>
      <BFormGroup :label="t('bt.auth.password')" label-for="sign-up-password">
        <BFormInput
          id="sign-up-password"
          v-model="form.user.password"
          type="password"
          required
          minlength="12"
          :placeholder="t('bt.auth.password')"
        />
        <BFormText>{{ t('bt.auth.password_hint') }}</BFormText>
      </BFormGroup>
    </fieldset>
    <fieldset>
      <legend>{{ t('bt.auth.personal_info') }}</legend>
      <BFormGroup :label="t('bt.person.name_label')" label-for="sign-up-name">
        <BFormInput
          id="sign-up-name"
          v-model="form.user.person_attributes.name"
          type="text"
          required
          :placeholder="t('bt.person.name_label')"
        />
      </BFormGroup>
      <BFormGroup :label="t('bt.person.description_label')" label-for="sign-up-description">
        <BFormTextarea
          id="sign-up-description"
          v-model="form.user.person_attributes.description"
          required
          :placeholder="t('bt.person.description_label')"
          rows="3"
        />
      </BFormGroup>
    </fieldset>
    <BButton type="submit" variant="primary" class="w-100" :disabled="loading">
      {{ t('bt.auth.sign_up') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormText, BButton } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useToaster } from '../composables/useToaster'

const { t } = useI18n()

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
