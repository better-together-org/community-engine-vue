import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BtRouter, { BtRoutes } from './router'

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
import SyncBadge from './components/sync/SyncBadge.vue'
import SyncStatusBar from './components/sync/SyncStatusBar.vue'
import OfflineBanner from './components/sync/OfflineBanner.vue'

export {
  useAuthStore,
  useCommunityStore,
  useMenuStore,
  usePeopleStore,
  useSyncStore,
} from './stores'

export { getDb } from './db/client'

export { useResource } from './composables/useResource'
export { usePosts } from './composables/usePosts'
export { useEvents } from './composables/useEvents'
export { useConversations } from './composables/useConversations'
export { useMessages } from './composables/useMessages'
export { useMembers } from './composables/useMembers'
export { useNotifications } from './composables/useNotifications'
export { useSyncStatus } from './composables/useSyncStatus'

library.add(faExternalLinkAlt)

const NAME = 'CommunityEngineVue'

const install = (app) => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
  app.component('BtNavUser', BtNavUser)
  app.component('BtUserNewPasswordForm', BtUserNewPasswordForm)
}

const CommunityEngineVue = { install, NAME }

export { install, NAME, CommunityEngineVue }
export {
  BtHeader,
  BtMainContent,
  BtNavBar,
  BtNavItem,
  BtNavUser,
  BtRouter,
  BtRoutes,
  BtUserNewPasswordForm,
  BtUserResendConfirmationForm,
  BtUserResetPasswordForm,
  BtUserSignInForm,
  BtUserSignUpForm,
  SyncBadge,
  SyncStatusBar,
  OfflineBanner,
}
export default CommunityEngineVue
