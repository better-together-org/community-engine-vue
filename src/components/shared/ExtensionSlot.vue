<template>
  <component
    :is="inj.component"
    v-for="(inj, i) in injections"
    :key="i"
    v-bind="resolvedProps(inj)"
  />
</template>

<script setup>
import { computed } from 'vue'
import { getSlotInjections } from '../../slot-registry'

const props = defineProps({
  target:  { type: String, required: true },
  slot:    { type: String, required: true },
  context: { type: Object, default: () => ({}) },
})

const injections = computed(() => getSlotInjections(props.target, props.slot))

function resolvedProps(inj) {
  return typeof inj.props === 'function'
    ? inj.props(props.context)
    : (inj.props ?? {})
}
</script>
