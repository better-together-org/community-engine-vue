<template>
  <div
    class="bt-community-header"
    :style="coverStyle"
  >
    <div class="bt-community-header__overlay">
      <div class="bt-community-header__content">
        <slot name="logo">
          <img
            v-if="community.logo_url"
            :src="community.logo_url"
            class="bt-community-header__logo"
            :alt="community.name"
          >
        </slot>
        <slot name="title">
          <h1 class="bt-community-header__name">
            {{ community.name }}
          </h1>
        </slot>
        <slot name="description">
          <p
            v-if="community.description"
            class="bt-community-header__description"
          >
            {{ community.description }}
          </p>
        </slot>
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  community: { type: Object, required: true },
})

const coverStyle = computed(() => {
  if (props.community.cover_image_url) {
    return {
      backgroundImage: `url(${props.community.cover_image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: `center ${props.community.cover_image_position_y || 'center'}`,
    }
  }
  return { backgroundColor: 'var(--bt-primary, #4f46e5)' }
})
</script>

<style scoped lang="scss">
.bt-community-header {
  min-height: 200px;
  position: relative;

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6));
    display: flex;
    align-items: flex-end;
  }

  &__content {
    padding: 1.5rem;
    color: white;
  }

  &__logo {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
    margin-bottom: 0.5rem;
  }

  &__name {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  &__description {
    opacity: 0.9;
    margin-bottom: 0;
  }
}
</style>
