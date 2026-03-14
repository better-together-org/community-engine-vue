<template>
  <BForm class="bt-offer-form" @submit.prevent="handleSubmit">
    <BFormGroup label="What are you offering?" label-for="offer-title">
      <BFormInput id="offer-title" v-model="form.title" required placeholder="e.g. Web design help, Gardening, Guitar lessons" />
    </BFormGroup>
    <BFormGroup label="Description" label-for="offer-description">
      <BFormTextarea id="offer-description" v-model="form.description" rows="3" placeholder="Describe what you can offer in more detail…" />
    </BFormGroup>
    <BFormGroup label="Category" label-for="offer-category">
      <BFormInput id="offer-category" v-model="form.category" placeholder="e.g. Skills, Labour, Knowledge, Goods" />
    </BFormGroup>
    <BFormGroup label="Time credits" label-for="offer-credits">
      <BFormInput id="offer-credits" v-model.number="form.time_credits" type="number" min="1" max="100" />
      <template #description>1 time credit = 1 hour. All labor is equally valued.</template>
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-3">
      <BButton type="button" variant="outline-secondary" @click="$emit('cancel')">Cancel</BButton>
      <BButton type="submit" variant="success">Add Offer</BButton>
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
