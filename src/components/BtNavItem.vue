<template>
  <b-nav-item
    :class="navitemClass"
    :href="localHref"
    :target="target"
    :title="localTitle"
    :to="localTo"
  >
    <nobr>
      {{ label }}
      <font-awesome-icon
        v-if="external"
        icon="external-link-alt"
        size="xs"
        title="External Link"
      />
    </nobr>
  </b-nav-item>
</template>

<script>
export default {
  name: 'BtNavItem',
  props: {
    id: {
      type: Number,
      default: 0,
    },
    external: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: 'Label',
    },
    navitemClass: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '#',
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    target: {
      type: String,
      default: '_self',
    },
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      default: '#',
    },
  },
  computed: {
    localHref() { return this.external ? this.url : undefined },
    localTitle() { return this.title !== '' ? this.title : this.label },
    localTo() { return !this.external ? this.path : undefined },
  },
}
</script>

<style scoped lang="scss">
@import '../stylesheets/theme.scss';
.nav-item {
  color: red;

  ::v-deep > a.nav-link {
    font-weight: bold;
    color: $default-text-color-bg-dark;

    &.router-link-exact-active,
    &:hover {
      color: $accent-color;
    }
  }
}
</style>
