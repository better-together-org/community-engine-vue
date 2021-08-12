import './plugins'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BtRouter, { BtRoutes } from './router'
import BtStore, { BtStoreModules, BtStorePlugins } from './store'

import BtHeader from './components/BtHeader.vue'
import BtMainContent from './components/BtMainContent.vue'
import BtNavBar from './components/BtNavBar.vue'
import BtNavItem from './components/BtNavItem.vue'
import BtNavUser from './components/BtNavUser.vue'

import BtUserNewPasswordForm from './components/BtUserNewPasswordForm.vue'
import BtUserResendConfirmationForm from './components/BtUserResendConfirmationForm.vue'
import BtUserResetPasswordForm from './components/BtUserResetPasswordForm.vue'
import BtUserSignInForm from './components/BtUserSignInForm.vue'
import BtUserSignUpForm from './components/BtUserSignUpForm.vue'

library.add(faExternalLinkAlt)

const NAME = 'CommunityEngineVue'

const install = (Vue) => {
  Vue.component('FontAwesomeIcon', FontAwesomeIcon)
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
  BtHeader,
  BtMainContent,
  BtNavBar,
  BtNavItem,
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
