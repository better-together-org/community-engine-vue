<template>
  <header
    id="bt-header"
    class="container-fluid"
  >
    <b-navbar
      toggleable="lg"
      :type="backgroundStyle"
      :style="headerStyle()"
    >
      <div
        id="nav-inner"
        class="container"
      >
        <slot name="branding-logo">
          <BtBrandingLogo />
        </slot>
        <b-navbar-toggle target="mobile-collapse" />
        <b-collapse
          id="right-collapse"
          is-nav
          invisible
        >
          <BtNavBar navbar-class="ml-auto justify-content-center" />
        </b-collapse>

        <b-collapse
          id="mobile-collapse"
          is-nav
        >
          <BtNavBar
            navbar-class="m-auto d-block d-lg-none center"
          />
        </b-collapse>
      </div>
    </b-navbar>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import BtBrandingLogo from './BtBrandingLogo.vue'
import BtNavBar from './BtNavBar.vue'

export default {
  name: 'BtHeader',
  components: {
    BtBrandingLogo,
    BtNavBar,
  },
  props: {
    backgroundStyle: {
      type: String,
      default: () => 'dark',
    },
  },
  computed: {
    ...mapGetters('CommunityEngine/Communities', ['customization']),
  },
  methods: {
    headerStyle() {
      const styles = {
        backgroundColor: this.customization.backgroundColor,
      }

      if (this.customization.coverImageUrl !== '' && this.customization.coverImageUrl !== undefined) {
        styles.backgroundImage = `url(${this.customization.coverImageUrl})`
        styles.backgroundPositionY = this.customization.coverImagePositionY
      }

      return styles
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';
@import 'bootstrap/scss/_mixins.scss';
@import '../stylesheets/theme.scss';

#bt-header {
  min-height: 15vh;

  nav {
    z-index: 1000;
    background-repeat: no-repeat;
    background-size: cover;

    ::v-deep #nav-inner {
      position: relative;
    }
  }

  #right-collapse {
    bottom: 0;
    position: absolute;
    right: 0;
  }

  #mobile-collapse.show {
    ::v-deep .user-dropdown {
      a.dropdown-toggle {
        > span {
          max-width: initial;
        }
      }
      a.dropdown-item {
        text-align: center;
        color: $default-text-color-bg-dark;

        &.router-link-exact-active,
        &:hover {
          background-color: initial;
          color: $accent-color;
        }
      }
      ul.dropdown-menu {
        background-color: initial;
      }
    }
  }

  .navbar-toggler >>> .navbar-toggler-icon {
    width: 1em;
    height: 1em;
  }
}
</style>
