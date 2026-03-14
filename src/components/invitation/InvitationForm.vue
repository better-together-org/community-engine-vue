<template>
  <BForm class="bt-invitation-form" @submit.prevent="handleSubmit">
    <BFormGroup label="Email address" label-for="invitation-email">
      <BFormInput id="invitation-email" v-model="form.email" type="email" required placeholder="person@example.com" />
    </BFormGroup>
    <BFormGroup label="Name (optional)" label-for="invitation-name">
      <BFormInput id="invitation-name" v-model="form.name" placeholder="Their name" />
    </BFormGroup>
    <BFormGroup label="Personal message (optional)" label-for="invitation-message">
      <BFormTextarea id="invitation-message" v-model="form.message" rows="3" placeholder="Add a personal message…" />
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-3">
      <BButton type="button" variant="outline-secondary" @click="$emit('cancel')">Cancel</BButton>
      <BButton type="submit" variant="primary">Send Invitation</BButton>
    </div>
  </BForm>
</template>
<script setup>
import { reactive } from 'vue'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'
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
