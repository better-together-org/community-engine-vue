<template>
  <b-nav-item-dropdown
    class="user-dropdown"
    :text="dropdownText"
    right
  >
    <b-dropdown-item
      v-if="isAuthenticated"
      to="/me"
    >
      Me
    </b-dropdown-item>
    <b-dropdown-item
      v-if="isAuthenticated"
      @click="signOutAction"
    >
      Sign Out
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!isAuthenticated"
      to="/users/sign-in"
    >
      Sign In
    </b-dropdown-item>
    <b-dropdown-item
      v-if="!isAuthenticated"
      to="/users/sign-up"
    >
      Sign Up
    </b-dropdown-item>
    <b-dropdown-item
      to="/"
    >
      Better Together
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import toaster from '../mixins/toaster'

export default {
  name: 'NavUser',
  mixins: [toaster],
  computed: {
    ...mapState('CommunityEngine/Authentication', ['currentUser']),
    ...mapGetters('CommunityEngine/Authentication', ['isAuthenticated']),
    ...mapState('CommunityEngine/People', ['currentPerson']),
    ...mapGetters('CommunityEngine/People', ['hasCurrentPerson']),
    dropdownText() {
      if (this.isAuthenticated) {
        if (this.hasCurrentPerson) return this.currentPerson.name
        return this.currentUser.email
      }

      return 'Sign In'
    },
  },
  methods: {
    ...mapActions('CommunityEngine/Authentication', ['signOut']),
    signOutAction() {
      this.signOut().then(() => {
        if (this.$route.path !== '/') {
          this.$router.push('/').then(() => {
            this.$toaster('You are now signed out!', 'info')
          })
        } else {
          this.$toaster('You are now signed out!', 'info')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
  @import '../stylesheets/theme.scss';

  .user-dropdown {
    ::v-deep a.dropdown-item {
      font-weight: bold;
      color: $default-text-color;
      text-align: right;

      &.router-link-exact-active,
      &:hover {
        color: $accent-color;
      }
    }

    ::v-deep a.dropdown-toggle {
      font-weight: bold;
      color: $default-text-color-bg-dark;

      &.router-link-exact-active,
      &:hover {
        color: $accent-color;
      }

      > span {
        max-width: 75px;
        display: inline-block;
        overflow: clip;
      }
    }
  }
</style>
