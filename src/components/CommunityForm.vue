<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup
      :label="t('bt.communities.name_label')"
      label-for="community-name"
    >
      <BFormInput
        id="community-name"
        v-model="form.name"
        type="text"
        required
        :placeholder="t('bt.communities.name_label')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.communities.description_label')"
      label-for="community-description"
    >
      <BFormTextarea
        id="community-description"
        v-model="form.description"
        rows="3"
        required
        :placeholder="t('bt.communities.description_label')"
      />
    </BFormGroup>
    <BButton
      type="submit"
      variant="primary"
    >
      {{ t('bt.communities.save') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'

const { t } = useI18n()

const props = defineProps({
  model: { type: Object, default: () => ({}) },
})
const emit = defineEmits(['submit'])

const form = reactive({ name: props.model.name || '', description: props.model.description || '' })

function handleSubmit() {
  emit('submit', { ...form })
}
</script>
