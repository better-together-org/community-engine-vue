<template>
  <div id="sign-up">
    <section>
      <h2>Sign Up</h2>
      <BtUserSignUpForm :model="user" />
      <div>
        <b-link to="/users/sign-in">
          Already have an account? Sign in!
        </b-link>
      </div>
      <div>
        <b-link to="/users/confirmation/resend">
          Didn't receive your account confirmation email? Resend it!
        </b-link>
      </div>
    </section>
  </div>
</template>

<script>
import BtUserSignUpForm from '../components/BtUserSignUpForm.vue'

export default {
  name: 'UsersSignIn',
  components: {
    BtUserSignUpForm,
  },
  data() {
    return {
      formValues: {},
    }
  },
  computed: {
    user() {
      return {}
    },
  },
}
</script>

<style scoped lang="scss">
  @media (min-width: 992px) {
    #sign-up {
      width: 50vw;
      margin: auto;

      section {
        padding: 10%;
      }
    }
  }

  .login-form {
    padding: 2em;
    border: 1px solid #a8a8a8;
    border-radius: .5em;
    max-width: 500px;
    box-sizing: border-box;
  }
  .form-title {
    margin-top: 0;
  }
  .login-form::v-deep .formulate-input .formulate-input-element {
    max-width: none;
  }
  @media (min-width: 420px) {
    .double-wide {
      display: flex;
    }
    .double-wide .formulate-input {
      flex-grow: 1;
      width: calc(50% - .5em);
    }
    .double-wide .formulate-input:first-child {
      margin-right: .5em;
    }
    .double-wide .formulate-input:last-child {
      margin-left: .5em;
    }
  }
</style>
