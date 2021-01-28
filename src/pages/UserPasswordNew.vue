<template>
  <div id="new-password">
    <section>
      <h2>Create a New Password</h2>
      <BtUserNewPasswordForm :model="model" />
    </section>
  </div>
</template>

<script>
import BtUserNewPasswordForm from '../components/BtUserNewPasswordForm.vue'

export default {
  name: 'UsersNewPassword',
  components: {
    BtUserNewPasswordForm,
  },
  props: {
    resetPasswordToken: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formValues: {},
    }
  },
  computed: {
    model() {
      return {
        user: {
          reset_password_token: this.resetPasswordToken,
        },
      }
    },
  },
}
</script>

<style scoped lang="scss">
  @media (min-width: 992px) {
    #new-password {
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
