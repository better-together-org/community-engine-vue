<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup label="Name" label-for="profile-name">
      <BFormInput id="profile-name" v-model="localModel.name" type="text" placeholder="Your name" />
    </BFormGroup>
    <BFormGroup label="Description" label-for="profile-description">
      <BFormTextarea id="profile-description" v-model="localModel.description" rows="3" placeholder="Your bio" />
    </BFormGroup>
    <BButton type="submit" variant="primary">Save Profile</BButton>
  </BForm>
</template>

<script setup>
import { computed } from 'vue'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'

const props = defineProps({
  model: { type: Object, required: true },
})
const emit = defineEmits(['update:model'])

const localModel = computed({
  get: () => props.model,
  set: (val) => emit('update:model', val),
})

function handleSubmit() {
  emit('update:model', localModel.value)
}
</script>
