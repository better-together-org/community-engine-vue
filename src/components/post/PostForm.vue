<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup
      :label="t('bt.posts.title_label')"
      label-for="post-title"
    >
      <BFormInput
        id="post-title"
        v-model="form.title"
        required
        :placeholder="t('bt.posts.title_label')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.posts.content_label')"
      label-for="post-content"
    >
      <BFormTextarea
        id="post-content"
        v-model="form.content"
        rows="5"
        :placeholder="t('bt.posts.content_label')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.posts.privacy_label')"
      label-for="post-privacy"
    >
      <BFormSelect
        id="post-privacy"
        v-model="form.privacy"
        :options="privacyOptions"
      />
    </BFormGroup>
    <BButton
      type="submit"
      variant="primary"
      :disabled="loading"
    >
      <BSpinner
        v-if="loading"
        small
      />
      {{ loading ? t('bt.posts.saving') : t('bt.posts.save') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BFormSelect, BButton, BSpinner } from 'bootstrap-vue-next'

const { t } = useI18n()

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
