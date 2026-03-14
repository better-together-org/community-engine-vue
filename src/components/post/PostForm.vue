<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup label="Title" label-for="post-title">
      <BFormInput id="post-title" v-model="form.title" required placeholder="Post title" />
    </BFormGroup>
    <BFormGroup label="Content" label-for="post-content">
      <BFormTextarea id="post-content" v-model="form.content" rows="5" placeholder="What's on your mind?" />
    </BFormGroup>
    <BFormGroup label="Privacy" label-for="post-privacy">
      <BFormSelect id="post-privacy" v-model="form.privacy" :options="privacyOptions" />
    </BFormGroup>
    <BButton type="submit" variant="primary" :disabled="loading">
      <BSpinner v-if="loading" small /> {{ loading ? 'Saving…' : 'Save Post' }}
    </BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect, BButton, BSpinner } from 'bootstrap-vue-next'

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  communityId: { type: String, default: null },
})
const emit = defineEmits(['submit'])

const loading = ref(false)
const form = reactive({
  title: props.model.title || '',
  content: props.model.content || '',
  privacy: props.model.privacy || 'public',
  community_id: props.communityId || props.model.community_id || null,
})

const privacyOptions = [
  { value: 'public', text: 'Public' },
  { value: 'protected', text: 'Community members only' },
  { value: 'private', text: 'Private' },
]

async function handleSubmit() {
  loading.value = true
  try {
    emit('submit', { ...form })
  } finally {
    loading.value = false
  }
}
</script>
