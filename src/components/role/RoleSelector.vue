<template>
  <BFormSelect
    :model-value="modelValue"
    :options="roleOptions"
    :disabled="loading"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<script setup>
import { computed } from 'vue'
import { BFormSelect } from 'bootstrap-vue-next'
import { useRoles } from '../../composables/useRoles'

const props = defineProps({
  modelValue: { type: String, default: null },
  resourceType: { type: String, default: null },
  resourceId: { type: String, default: null },
})

defineEmits(['update:modelValue'])

const { scopedRoles, loading } = useRoles(props.resourceType, props.resourceId)

const roleOptions = computed(() => [
  { value: null, text: '—' },
  ...scopedRoles.value.map((r) => ({ value: r.id, text: r.name })),
])
</script>
