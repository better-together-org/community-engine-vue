<template>
  <BForm @submit.prevent="handleSubmit">
    <BFormGroup
      :label="t('bt.person.name_label')"
      label-for="profile-name"
    >
      <BFormInput
        id="profile-name"
        v-model="localModel.name"
        type="text"
        :placeholder="t('bt.person.name_label')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.person.description_label')"
      label-for="profile-description"
    >
      <BFormTextarea
        id="profile-description"
        v-model="localModel.description"
        rows="3"
        :placeholder="t('bt.person.description_label')"
      />
    </BFormGroup>
    <BButton
      type="submit"
      variant="primary"
    >
      {{ t('bt.actions.save') }}
    </BButton>
  </BForm>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'

const { t } = useI18n()

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
