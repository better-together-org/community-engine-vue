<template>
  <BForm
    class="bt-offer-form"
    @submit.prevent="handleSubmit"
  >
    <BFormGroup
      :label="t('bt.joatu.offers.title_label')"
      label-for="offer-title"
    >
      <BFormInput
        id="offer-title"
        v-model="form.title"
        required
        :placeholder="t('bt.joatu.offers.title_placeholder')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.joatu.offers.description_label')"
      label-for="offer-description"
    >
      <BFormTextarea
        id="offer-description"
        v-model="form.description"
        rows="3"
        :placeholder="t('bt.joatu.offers.description_placeholder')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.joatu.offers.category_label')"
      label-for="offer-category"
    >
      <BFormInput
        id="offer-category"
        v-model="form.category"
        :placeholder="t('bt.joatu.offers.category_placeholder')"
      />
    </BFormGroup>
    <BFormGroup
      :label="t('bt.joatu.offers.credits_label')"
      label-for="offer-credits"
    >
      <BFormInput
        id="offer-credits"
        v-model.number="form.time_credits"
        type="number"
        min="1"
        max="100"
      />
      <template #description>
        {{ t('bt.joatu.offers.credits_hint') }}
      </template>
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-3">
      <BButton
        type="button"
        variant="outline-secondary"
        @click="$emit('cancel')"
      >
        {{ t('bt.actions.cancel') }}
      </BButton>
      <BButton
        type="submit"
        variant="success"
      >
        {{ t('bt.joatu.offers.submit') }}
      </BButton>
    </div>
  </BForm>
</template>
<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { BForm, BFormGroup, BFormInput, BFormTextarea, BButton } from 'bootstrap-vue-next'
const { t } = useI18n()
const emit = defineEmits(['submit', 'cancel'])
const form = reactive({ title: '', description: '', category: '', time_credits: 1 })
function handleSubmit() {
  if (!form.title) return
  emit('submit', { ...form })
  Object.assign(form, { title: '', description: '', category: '', time_credits: 1 })
}
</script>
