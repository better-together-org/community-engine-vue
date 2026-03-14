<template>
  <BBadge :variant="variantFor(role.slug)">
    {{ role.name }}
  </BBadge>
</template>

<script setup>
import { BBadge } from 'bootstrap-vue-next'

defineProps({
  role: { type: Object, required: true },
})

function variantFor(slug) {
  if (slug === 'admin') return 'danger'
  if (slug === 'moderator') return 'warning'
  return 'secondary'
}
</script>
