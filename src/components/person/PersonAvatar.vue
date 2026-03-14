<template>
  <div class="bt-person-avatar" :style="avatarStyle" :title="person.name">
    <img v-if="person.profile_image_url" :src="person.profile_image_url" :alt="person.name" class="bt-person-avatar__img" />
    <span v-else class="bt-person-avatar__initials">{{ initials }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  person: { type: Object, required: true },
  size: { type: Number, default: 40 },
})

const initials = computed(() => {
  const parts = (props.person.name || props.person.handle || '?').split(' ')
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('')
})

const avatarStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  fontSize: `${props.size * 0.4}px`,
}))
</script>

<style scoped lang="scss">
.bt-person-avatar {
  border-radius: 50%;
  background-color: var(--bt-primary, #4f46e5);
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;

  &__img { width: 100%; height: 100%; object-fit: cover; }
  &__initials { font-weight: 600; line-height: 1; }
}
</style>
