<template>
  <div id="me">
    <section id="introduction">
      <div class="col">
        <h1>Me</h1>
        <div v-if="peopleStore.hasMe">
          <h2>{{ peopleStore.me.name }}</h2>
          <p>{{ peopleStore.me.description }}</p>
        </div>
        <BButton
          v-if="!peopleStore.hasMe"
          v-b-modal="'my-profile-modal'"
          variant="primary"
        >
          Fill out your profile
        </BButton>
      </div>
    </section>
    <BModal
      id="my-profile-modal"
      title="My Profile"
      @ok.prevent="setProfile"
    >
      <p class="my-4">Fill out your profile details</p>
      <p v-if="peopleStore.currentPersonChanged">changed</p>
      <BtProfileForm :model="peopleStore.currentPerson" />
      <div>{{ formErrors }}</div>
    </BModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { BButton, BModal } from 'bootstrap-vue-next'
import { usePeopleStore } from '../stores/people'
import BtProfileForm from '../components/BtProfileForm.vue'

const peopleStore = usePeopleStore()
const formErrors = ref('')

async function setProfile() {
  try {
    await peopleStore.postPerson(peopleStore.currentPerson)
    formErrors.value = ''
  } catch (err) {
    formErrors.value = err?.response?.data || 'Error saving profile'
  }
}
</script>

<style scoped lang="scss">
h2 {
  margin-bottom: 1.5rem;
}
</style>
