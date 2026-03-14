<template>
  <BForm class="bt-invitation-form" @submit.prevent="handleSubmit">
    <BFormGroup :label="t('bt.invitations.email_label')" label-for="invitation-email">
      <BFormInput
        id="invitation-email"
        v-model="form.email"
        type="email"
        required
        :placeholder="t('bt.invitations.email_placeholder')"
      />
    </BFormGroup>
    <BFormGroup :label="t('bt.invitations.name_label')" label-for="invitation-name">
      <BFormInput
        id="invitation-name"
        v-model="form.name"
        :placeholder="t('bt.invitations.name_placeholder')"
      />
    </BFormGroup>
    <BFormGroup :label="t('bt.invitations.message_label')" label-for="invitation-message">
      <BFormTextarea
        id="invitation-message"
        v-model="form.message"
        rows="3"
        :placeholder="t('bt.invitations.message_placeholder')"
      />
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-3">
      <BButton type="button" variant="outline-secondary" @click="$emit('cancel')">
        {{ t('bt.actions.cancel') }}
      </BButton>
      <BButton type="submit" variant="primary">{{ t('bt.invitations.send') }}</BButton>
    </div>
  </BForm>
</template>
<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'
const { t } = useI18n()
const emit = defineEmits(['submit', 'cancel'])
const form = reactive({ email: '', name: '', message: '' })
function handleSubmit() {
  if (!form.email) return
  emit('submit', { ...form })
  form.email = ''
  form.name = ''
  form.message = ''
}
</script>
