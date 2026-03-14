<template>
  <div id="app">
    <BToastOrchestrator />
    <SyncStatusBar />
    <BtHeader />
    <OfflineBanner />
    <BtMainContent />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { BToastOrchestrator } from 'bootstrap-vue-next'
import { useMenuStore } from './stores/menus'
import { useSyncStore } from './stores/sync'
import BtHeader from './components/BtHeader.vue'
import BtMainContent from './components/BtMainContent.vue'
import SyncStatusBar from './components/sync/SyncStatusBar.vue'
import OfflineBanner from './components/sync/OfflineBanner.vue'

const menuStore = useMenuStore()
const syncStore = useSyncStore()

onMounted(() => {
  menuStore.setHeaderMenuItems([
    { id: 0, external: false, label: 'About', path: '/about', title: 'About the Better Together Community', sortOrder: 0 },
  ])
  syncStore.initNetworkListeners()
})
</script>

<style lang="scss">
@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
@import 'stylesheets/theme.scss';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $default-text-color;

  a {
    color: $accent-color;
    &:hover { color: $accent-color; }
  }

  .btn-primary {
    color: $default-text-color-bg-dark;
    background-color: $accent-color;
    border-color: $accent-color;
    &:hover, &:focus, &:active {
      color: $default-text-color-bg-dark;
      background-color: #399f71;
      border-color: #399f71;
    }
  }

  header, footer {
    padding: 0;
    .navbar-nav {
      a {
        font-weight: bold;
        color: $default-text-color-bg-dark;
        &.router-link-exact-active, &:hover { color: $accent-color; }
      }
      ul.dropdown-menu a {
        color: $default-text-color;
        &:hover { color: $accent-color; }
      }
      @include media-breakpoint-up(md) {
        li.nav-item {
          margin-right: 1vw;
          &:last-child { margin-right: 0; }
        }
      }
    }
  }

  @include media-breakpoint-down(lg) {
    header, footer { height: 10vh; }
  }
}
</style>
