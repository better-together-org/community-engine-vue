<template>
  <RouterLink
    to="/"
    class="navbar-brand"
  >
    <img
      class="logo"
      src="../assets/better-together-logo.png"
      alt="Better Together"
    >
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';

.logo { height: 10vh; }
.navbar-brand { margin-right: 5vw; }

@include media-breakpoint-down(lg) {
  .logo { height: 7vh; }
}
</style>
