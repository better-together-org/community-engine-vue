<template>
  <div
    id="me"
    class=""
  >
    <section
      id="introduction"
    >
      <div class="col">
        <h1>Me</h1>
        <p>
          My page
        </p>
        <div v-if="hasMe">
          Person:
          {{ me }}
        </div>
        <b-btn
          v-if="!hasMe"
          v-b-modal.my-profile-modal
          variant="primary"
        >
          Fill out your profile
        </b-btn>
      </div>
    </section>
    <b-modal
      id="my-profile-modal"
      title="My Profile"
      @ok.prevent="setProfile"
    >
      <p class="my-4">
        Fill out your profile details
      </p>
      <p v-if="currentPersonChanged">
        changed
      </p>
      <BtProfileForm :model="currentPerson" />
      <div>{{ formErrors }} </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import BtProfileForm from '../components/BtProfileForm.vue'

export default {
  name: 'Me',
  components: {
    BtProfileForm,
  },
  data() {
    return {
      formErrors: '',
    }
  },
  computed: {
    ...mapState('CommunityEngine/People', ['currentPerson', 'me']),
    ...mapGetters('CommunityEngine/People', ['hasMe', 'currentPersonChanged']),
  },
  methods: {
    ...mapActions('CommunityEngine/People', ['postPerson']),
    createCommunity() {
      this.postCommunity(this.newCommunity)
        .then(() => {
          this.formErrors = {}
          this.newCommunity = {}
        })
        .catch((response) => {
          this.formErrors = response
        })
    },
  },
}
</script>

<style scoped lang="scss">
  h2 {
    margin-bottom: 1.5rem;
  }
</style>
