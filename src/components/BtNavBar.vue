<template>
  <b-navbar-nav
    :class="navbarClass"
    pills
    align="center"
  >
    <!--
    <b-nav-item
      :class="navitemClass"
      to="/contact"
      title="Contact our Community"
    >
      Contact
    </b-nav-item> -->
    <BtNavItem
      v-for="menuItem in headerMenuItems"
      :id="menuItem.id"
      :key="menuItem.id"
      :external="menuItem.external"
      :label="menuItem.label"
      :target="menuItem.target"
      :title="menuItem.title"
      :path="menuItem.path"
      :url="menuItem.url"
      :navItemClass="navitemClass"
    />
    <BtNavUser v-if="isAuthenticated" />
  </b-navbar-nav>
</template>

<script>
import { mapGetters } from 'vuex'

import BtNavItem from './BtNavItem.vue'

export default {
  name: 'NavBar',
  components: {
    BtNavItem,
  },
  props: {
    navbarClass: {
      type: String,
      default: '',
    },
    navitemClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters('CommunityEngine/Authentication', ['isAuthenticated']),
    ...mapGetters('CommunityEngine/Menus', ['headerMenuItems']),
  },
}
</script>

<style scoped lang="scss">
  .center {
    text-align: center;
  }
</style>
