<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup label="Name" label-for="event-name">
      <BFormInput id="event-name" v-model="form.name" required placeholder="Event name" />
    </BFormGroup>
    <BFormGroup label="Description" label-for="event-description">
      <BFormTextarea id="event-description" v-model="form.description" rows="3" placeholder="Describe your event" />
    </BFormGroup>
    <BRow>
      <BCol md="6">
        <BFormGroup label="Starts at" label-for="event-starts">
          <BFormInput id="event-starts" v-model="form.starts_at" type="datetime-local" />
        </BFormGroup>
      </BCol>
      <BCol md="6">
        <BFormGroup label="Ends at" label-for="event-ends">
          <BFormInput id="event-ends" v-model="form.ends_at" type="datetime-local" />
        </BFormGroup>
      </BCol>
    </BRow>
    <BFormGroup label="Privacy" label-for="event-privacy">
      <BFormSelect id="event-privacy" v-model="form.privacy" :options="privacyOptions" />
    </BFormGroup>
    <BButton type="submit" variant="primary">Save Event</BButton>
  </BForm>
</template>

<script setup>
import { reactive } from 'vue'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect, BButton, BRow, BCol } from 'bootstrap-vue-next'

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  communityId: { type: String, default: null },
})
const emit = defineEmits(['submit'])

const form = reactive({
  name: props.model.name || '',
  description: props.model.description || '',
  starts_at: props.model.starts_at || '',
  ends_at: props.model.ends_at || '',
  privacy: props.model.privacy || 'public',
  community_id: props.communityId || props.model.community_id || null,
})

const privacyOptions = [
  { value: 'public', text: 'Public' },
  { value: 'protected', text: 'Community members only' },
  { value: 'private', text: 'Private' },
]

function handleSubmit() { emit('submit', { ...form }) }
</script>
