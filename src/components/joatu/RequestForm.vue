<template>
  <BForm class="bt-request-form" @submit.prevent="handleSubmit">
    <BFormGroup label="What do you need?" label-for="request-title">
      <BFormInput id="request-title" v-model="form.title" required placeholder="What do you need? e.g. Help moving, Childcare, Computer repair" />
    </BFormGroup>
    <BFormGroup label="Description" label-for="request-description">
      <BFormTextarea id="request-description" v-model="form.description" rows="3" placeholder="Describe what you need in more detail…" />
    </BFormGroup>
    <BFormGroup label="Category" label-for="request-category">
      <BFormInput id="request-category" v-model="form.category" placeholder="e.g. Skills, Labour, Knowledge, Goods" />
    </BFormGroup>
    <BFormGroup label="Time credits" label-for="request-credits">
      <BFormInput id="request-credits" v-model.number="form.time_credits" type="number" min="1" max="100" />
      <template #description>1 time credit = 1 hour. All labor is equally valued.</template>
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-3">
      <BButton type="button" variant="outline-secondary" @click="$emit('cancel')">Cancel</BButton>
      <BButton type="submit" variant="warning">Add Request</BButton>
    </div>
  </BForm>
</template>
<script setup>
import { reactive } from 'vue'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'
const emit = defineEmits(['submit', 'cancel'])
const form = reactive({ title: '', description: '', category: '', time_credits: 1 })
function handleSubmit() {
  if (!form.title) return
  emit('submit', { ...form })
  Object.assign(form, { title: '', description: '', category: '', time_credits: 1 })
}
</script>
