import BtNavUser from './components/BtNavUser.vue'
import BtRouter, { BtRoutes } from './router'
import BtStore, { BtStoreModules, BtStorePlugins } from './store'

import BtUserNewPasswordForm from './components/BtUserNewPasswordForm.vue'
import BtUserResendConfirmationForm from './components/BtUserResendConfirmationForm.vue'
import BtUserResetPasswordForm from './components/BtUserResetPasswordForm.vue'
import BtUserSignInForm from './components/BtUserSignInForm.vue'
import BtUserSignUpForm from './components/BtUserSignUpForm.vue'

const NAME = 'CommunityEngineVue'

const install = (Vue) => {
  Vue.component('BtNavUser', BtNavUser)
  Vue.component('BtUserNewPasswordForm', BtUserNewPasswordForm)
}

// --- CommunityEngineVue plugin ---
const CommunityEngineVue = /* #__PURE__ */ {
  install,
  NAME,
}

export {
  install,
  NAME,
  CommunityEngineVue,
}

export {
  BtNavUser,
  BtRouter,
  BtRoutes,
  BtStore,
  BtStoreModules,
  BtStorePlugins,
  BtUserNewPasswordForm,
  BtUserResendConfirmationForm,
  BtUserResetPasswordForm,
  BtUserSignInForm,
  BtUserSignUpForm,
}

// Default export is the CommunityEngineVue plugin
export default CommunityEngineVue
