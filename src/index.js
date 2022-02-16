import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BtPlugins from './plugins'
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

const nodeEnv = process.env.NODE_ENV
const developmentMode = (() => nodeEnv === 'development')

let verboseLogging = developmentMode

const NAME = 'CommunityEngineVue'

const availablePlugins = [
  {
    name: 'bootstrap-vue',
    module: BtPlugins.BootstrapVue,
  },
  {
    name: 'font-awesome',
    module: BtPlugins.FontAwesome,
  },
  {
    name: 'vue-form-generator',
    module: BtPlugins.VFG,
  },
  {
    name: 'vue-loading',
    module: BtPlugins.VueLoading,
  },
]

const installedPlugins = []

const installPlugin = async (plugin) => {
  const availablePlugin = availablePlugins.find(
    (available) => available.name === plugin,
  )
  if (!availablePlugin) return

  if (verboseLogging) console.log(`Attempting to install plugin ${plugin}`)

  try {
    availablePlugin.module.install()
    installedPlugins.push(plugin)
    if (verboseLogging) console.info(`Installed plugin ${plugin}`)
  } catch (error) {
    if (verboseLogging) console.error(plugin, availablePlugin, error.message)
  }
}

const defaultOptions = {
  selectedPlugins: availablePlugins.map((plugin) => plugin.name),
  excludePlugins: [],
  installEnginePlugins: true,
  verboseLogging: developmentMode,
}

const install = (Vue, userOptions = {}) => {
  Vue.component('FontAwesomeIcon', FontAwesomeIcon)
  Vue.component('BtNavUser', BtNavUser)
  Vue.component('BtUserNewPasswordForm', BtUserNewPasswordForm)

  const options = {
    ...defaultOptions,
    ...userOptions,
  }

  verboseLogging = options.verboseLogging
  if (verboseLogging) {
    console.log('*************************************')
    console.log('Let\'s Be Better Together!')
    console.log('The Community Engine Development Mode')
    console.log('*************************************')
    console.log('Options:', options)
  }

  if (options.installEnginePlugins) {
    if (verboseLogging) {
      console.log('-----', 'Attempting to install selected plugins', '-----')
      console.log(options.selectedPlugins)
    }
    options.selectedPlugins.forEach((plugin) => installPlugin(plugin, options))
  }
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
  installedPlugins,
  developmentMode,
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
