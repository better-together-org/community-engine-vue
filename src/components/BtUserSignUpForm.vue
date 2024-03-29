<template>
  <div id="sign-up-form">
    <div
      v-if="hasErrors"
      id="sign-up-errors"
      class="errors text-danger mb-4"
    >
      <h4>Errors</h4>
      <ul
        v-for="(value, name) in errors"
        :key="name"
      >
        <li>
          {{ name }}: {{ value.join(", ") }}
        </li>
      </ul>
    </div>
    <p><strong>*</strong> indicates a required field</p>
    <vue-form-generator
      tag="div"
      :schema="schema"
      :model="localModel"
      rows="3"
      max-rows="6"
      @validated="onValidated"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import VueFormGenerator from 'vue-form-generator'
import BtUserSignUpFormSchema from '../forms/BtUserSignUpFormSchema'
import errorHandling from '../mixins/error-handling'

export default {
  name: 'BtUserSignUpForm',
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
      schema: BtUserSignUpFormSchema,
      errors: {},
    }
  },
  computed: {
    hasErrors() { return Object.keys(this.errors).length > 0 },
    localModel: {
      get() { return this.model },
      set(model) { this.$emit('input', model) },
    },
  },
  methods: {
    ...mapActions('CommunityEngine/Authentication', ['signUp']),
    onValidated(isValid) {
      if (isValid) {
        this.errors = {}
        this.signUp(this.model).then((data) => {
          if (this.$route.path !== '/') {
            this.$router.push('/').then(() => {
              this.$toaster(
                `Please click on the confirmation link emailed to ${data.email} to log in.`,
                'info',
                {
                  title: 'Please confirm your email address',
                  autoHideDelay: 6000,
                },
              )
            })
          }
        }).catch(({ response }) => {
          // console.log(response)
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

#sign-up-form {
  ::v-deep .help-block {
    margin-top: 5px;

    &.errors {
      color: theme-color('danger')
    }
  }
  ::v-deep .hint {
    margin-top: 5px;
  }
}
#sign-up-errors {
  h4 {
    text-align: left;
  }
}
</style>
