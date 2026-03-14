<template>
  <BForm class="bt-message-form" @submit.prevent="handleSubmit">
    <BFormGroup>
      <BFormTextarea
        v-model="content"
        placeholder="Type a message…"
        rows="2"
        :disabled="submitting"
        @keydown.enter.ctrl.prevent="handleSubmit"
      />
    </BFormGroup>
    <div class="d-flex justify-content-end gap-2 mt-2">
      <BButton type="submit" variant="primary" size="sm" :disabled="!content.trim() || submitting">
        Send
      </BButton>
    </div>
  </BForm>
</template>
<script setup>
import { ref } from 'vue'
import { BForm, BFormGroup, BFormTextarea, BButton } from 'bootstrap-vue-next'
const emit = defineEmits(['submit'])
const content = ref('')
const submitting = ref(false)
async function handleSubmit() {
  if (!content.value.trim()) return
  submitting.value = true
  try {
    await emit('submit', { content: content.value })
    content.value = ''
  } finally {
    submitting.value = false
  }
}
</script>
