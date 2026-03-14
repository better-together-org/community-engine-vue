<template>
  <BNavbarNav :class="navbarClass" pills align="center">
    <BtNavItem
      v-for="item in menuStore.headerMenuItems"
      :id="item.id"
      :key="item.id"
      :external="item.external"
      :label="item.label"
      :target="item.target"
      :title="item.title"
      :path="item.path"
      :url="item.url"
      :navitem-class="navitemClass"
    />
    <BtNavUser v-if="authStore.isAuthenticated" />
  </BNavbarNav>
</template>

<script setup>
import { BNavbarNav } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menus'
import BtNavItem from './BtNavItem.vue'
import BtNavUser from './BtNavUser.vue'

defineProps({
  navbarClass: { type: String, default: '' },
  navitemClass: { type: String, default: '' },
})

const authStore = useAuthStore()
const menuStore = useMenuStore()
</script>

<style scoped lang="scss">
.center { text-align: center; }
</style>
