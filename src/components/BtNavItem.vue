<template>
  <BNavItem
    :class="navitemClass"
    :href="localHref"
    :target="target"
    :title="localTitle"
    :to="localTo"
  >
    <nobr>
      {{ label }}
      <FontAwesomeIcon v-if="external" icon="external-link-alt" size="xs" title="External Link" />
    </nobr>
  </BNavItem>
</template>

<script setup>
import { computed } from 'vue'
import { BNavItem } from 'bootstrap-vue-next'

const props = defineProps({
  id: { type: Number, default: 0 },
  external: { type: Boolean, default: false },
  label: { type: String, default: 'Label' },
  navitemClass: { type: String, default: '' },
  path: { type: String, default: '#' },
  sortOrder: { type: Number, default: 0 },
  target: { type: String, default: '_self' },
  title: { type: String, default: '' },
  url: { type: String, default: '#' },
})

const localHref = computed(() => props.external ? props.url : undefined)
const localTitle = computed(() => props.title !== '' ? props.title : props.label)
const localTo = computed(() => !props.external ? props.path : undefined)
</script>

<style scoped lang="scss">
@import '../stylesheets/theme.scss';

.nav-item {
  :deep(> a.nav-link) {
    font-weight: bold;
    color: $default-text-color-bg-dark;
    &.router-link-exact-active, &:hover { color: $accent-color; }
  }
}
</style>
