<template>
  <header
    id="bt-header"
    class="container-fluid"
  >
    <BNavbar
      toggleable="lg"
      :container="false"
      :variant="backgroundStyle"
      :style="headerStyle"
      data-bs-theme="dark"
    >
      <div
        id="nav-inner"
        class="container"
      >
        <slot name="branding-logo">
          <BtBrandingLogo />
        </slot>
        <BNavbarToggle target="nav-collapse" />
        <BCollapse
          id="nav-collapse"
          is-nav
        >
          <BtNavBar navbar-class="ms-auto justify-content-center" />
        </BCollapse>
      </div>
    </BNavbar>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { BNavbar, BNavbarToggle, BCollapse } from 'bootstrap-vue-next'
import { useCommunityStore } from '../stores/communities'
import BtBrandingLogo from './BtBrandingLogo.vue'
import BtNavBar from './BtNavBar.vue'

defineProps({
  backgroundStyle: { type: String, default: 'dark' },
})

const communityStore = useCommunityStore()

const headerStyle = computed(() => {
  const { customization } = communityStore
  const styles = { backgroundColor: customization.backgroundColor }
  if (customization.coverImageUrl) {
    styles.backgroundImage = `url(${customization.coverImageUrl})`
    styles.backgroundPositionY = customization.coverImagePositionY
  }
  return styles
})
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
@import '../stylesheets/theme.scss';

#bt-header {
  min-height: 15vh;
  nav {
    z-index: 1000;
    background-repeat: no-repeat;
    background-size: cover;
    :deep(#nav-inner) { position: relative; }
  }
  :deep(.navbar-toggler .navbar-toggler-icon) {
    width: 1em;
    height: 1em;
  }

  // Mobile: center nav items and don't stretch them full-width
  @include media-breakpoint-down(lg) {
    :deep(.navbar-collapse .navbar-nav) {
      align-items: center;
      padding: 0.5rem 0;
      .nav-item {
        width: auto;
        text-align: center;
      }
    }
  }
}
</style>
