<template>
  <b-navbar-brand :href="rootUrl">
    <img
      class="logo"
      :src="logoUrl"
      :alt="alt"
    >
  </b-navbar-brand>
</template>

<script>

import defaultLogo from '../assets/better-together-logo.png'

export default {
  name: 'BtBrandingLogo',
  props: {
    alt: {
      type: String,
      default: () => 'Better Together',
    },
    logoUrl: {
      type: String,
      default: () => defaultLogo,
    },
    rootUrl: {
      type: String,
      default: () => '/',
    },
  },
}
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';

.logo {
  height: 10vh;
}
.navbar-brand {
  margin-right: 5vw;
}

@include media-breakpoint-down(lg) {
  .logo {
    height: 7vh;
  }
}
</style>
