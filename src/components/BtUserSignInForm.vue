<template>
  <vue-form-generator
    id="sign-in-form"
    tag="form"
    :schema="schema"
    :model="localModel"
    rows="3"
    max-rows="6"
    @validated="onValidated"
  />
</template>

<script>
import { mapActions } from 'vuex'
import VueFormGenerator from 'vue-form-generator'
import BtUserSignInFormSchema from '../forms/BtUserSignInFormSchema'
import errorHandling from '../mixins/error-handling'

export default {
  name: 'UserSigninForm',
  components: {
    'vue-form-generator': VueFormGenerator.component,
  },
  mixins: [errorHandling],
  props: {
    model: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      schema: BtUserSignInFormSchema,
    }
  },
  computed: {
    localModel: {
      get() { return this.model },
      set(model) { this.$emit('input', model) },
    },
  },
  methods: {
    ...mapActions('CommunityEngine/Authentication', ['signIn']),
    ...mapActions('CommunityEngine/People', ['getMe']),
    onValidated(isValid) {
      if (isValid) {
        this.signIn(this.model).then(() => {
          if (this.$route.path !== '/') {
            this.$router.push('/').then(() => {
              this.$toaster('You are now signed in!', 'success')
              this.getMe().then((response) => {
                console.log(response)
              }).catch(({ response }) => {
                console.log(response)
                this.$handleResponseError(response)
              })
            })
          }
        }).catch(({ response }) => {
          this.$handleResponseError(response)
        })
      }
    },
  },
}
</script>

<style scoped lang="scss">
@import 'bootstrap/scss/_functions.scss';
@import 'bootstrap/scss/_variables.scss';

#sign-in-form {
  ::v-deep .help-block {
    margin-top: 5px;

    &.errors {
      color: theme-color('danger')
    }
  }
  .hint {
    margin-top: 5px;
  }
}
</style>
