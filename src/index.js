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
import ExtensionSlot from './components/shared/ExtensionSlot.vue'

import { setCevContext } from './context'
import { useCommunities } from './composables/useCommunities'
import { communityRoutes } from './router/communityRoutes'
import CommunityCard from './components/community/CommunityCard.vue'
import CommunityList from './components/community/CommunityList.vue'
import CommunityHeader from './components/community/CommunityHeader.vue'
import PersonCard from './components/person/PersonCard.vue'
import PersonAvatar from './components/person/PersonAvatar.vue'
import MemberList from './components/person/MemberList.vue'
import PostCard from './components/post/PostCard.vue'
import PostList from './components/post/PostList.vue'
import PostForm from './components/post/PostForm.vue'
import PostDetail from './components/post/PostDetail.vue'
import EventCard from './components/event/EventCard.vue'
import EventList from './components/event/EventList.vue'
import EventForm from './components/event/EventForm.vue'

export {
  useAuthStore,
  useCommunityStore,
  useMenuStore,
  usePeopleStore,
  useSyncStore,
} from './stores'

export { getDb, registerExtensionMigration } from './db/client'
export { startSync } from './db/sync'

export { useResource } from './composables/useResource'
export { usePosts } from './composables/usePosts'
export { useEvents } from './composables/useEvents'
export { useConversations } from './composables/useConversations'
export { useMessages } from './composables/useMessages'
export { useMembers } from './composables/useMembers'
export { useNotifications } from './composables/useNotifications'
export { useSyncStatus } from './composables/useSyncStatus'

export { getCevContext } from './context'
export { defineExtension } from './extension'
export { registerSlotInjection, getSlotInjections } from './slot-registry'

export { useCommunities } from './composables/useCommunities'
export { communityRoutes } from './router/communityRoutes'
export {
  CommunityCard,
  CommunityList,
  CommunityHeader,
  PersonCard,
  PersonAvatar,
  MemberList,
  PostCard,
  PostList,
  PostForm,
  PostDetail,
  EventCard,
  EventList,
  EventForm,
}

library.add(faExternalLinkAlt)

const NAME = 'CommunityEngineVue'

const install = (app, options = {}) => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
  app.component('BtNavUser', BtNavUser)
  app.component('BtUserNewPasswordForm', BtUserNewPasswordForm)
  app.component('ExtensionSlot', ExtensionSlot)

  // Apply theme CSS custom properties
  if (options.theme) {
    const root = document.documentElement
    const themeMap = {
      primary:    '--bt-primary',
      accent:     '--bt-accent',
      background: '--bt-background',
      text:       '--bt-text',
      fontFamily: '--bt-font-family',
    }
    Object.entries(options.theme).forEach(([k, v]) => {
      if (themeMap[k]) root.style.setProperty(themeMap[k], v)
    })
  }

  // Store plugin context so extensions and composables can access app + options
  setCevContext({ app, options })

  // Install companion extensions
  if (options.extensions?.length) {
    options.extensions.forEach((ext) => {
      if (ext._install) ext._install()
    })
  }

  app.component('BtCommunityCard', CommunityCard)
  app.component('BtPostCard', PostCard)
  app.component('BtEventCard', EventCard)
  app.component('BtPersonCard', PersonCard)
  app.component('BtPersonAvatar', PersonAvatar)
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
  ExtensionSlot,
}
export default CommunityEngineVue
