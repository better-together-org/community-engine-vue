<template>
  <BNavItemDropdown class="user-dropdown" :text="dropdownText" end>
    <BDropdownItem v-if="authStore.isAuthenticated" to="/me">Me</BDropdownItem>
    <BDropdownItem v-if="authStore.isAuthenticated" @click="handleSignOut">Sign Out</BDropdownItem>
    <BDropdownItem v-if="!authStore.isAuthenticated" to="/users/sign-in">Sign In</BDropdownItem>
    <BDropdownItem v-if="!authStore.isAuthenticated" to="/users/sign-up">Sign Up</BDropdownItem>
    <BDropdownItem to="/">Better Together</BDropdownItem>
  </BNavItemDropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { BNavItemDropdown, BDropdownItem } from 'bootstrap-vue-next'
import { useAuthStore } from '../stores/auth'
import { usePeopleStore } from '../stores/people'
import { useToaster } from '../composables/useToaster'

const authStore = useAuthStore()
const peopleStore = usePeopleStore()
const router = useRouter()
const { toast } = useToaster()

const dropdownText = computed(() => {
  if (authStore.isAuthenticated) {
    if (peopleStore.hasCurrentPerson) return peopleStore.currentPerson.name
    return authStore.currentUser.email
  }
  return 'Sign In'
})

async function handleSignOut() {
  await authStore.signOut()
  peopleStore.clearCurrentPerson()
  if (router.currentRoute.value.path !== '/') {
    await router.push('/')
  }
  toast('You are now signed out!', 'info')
}
</script>

<style scoped lang="scss">
@import '../stylesheets/theme.scss';

.user-dropdown {
  :deep(a.dropdown-item) {
    font-weight: bold;
    color: $default-text-color;
    text-align: right;
    &.router-link-exact-active, &:hover { color: $accent-color; }
  }
  :deep(a.dropdown-toggle) {
    font-weight: bold;
    color: $default-text-color-bg-dark;
    &.router-link-exact-active, &:hover { color: $accent-color; }
    > span { max-width: 75px; display: inline-block; overflow: clip; }
  }
}
</style>
