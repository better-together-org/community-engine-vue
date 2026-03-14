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
import { installI18n } from './i18n'
import { getDb } from './db/client'
import { startSync } from './db/sync'
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
import ConversationCard from './components/conversation/ConversationCard.vue'
import ConversationList from './components/conversation/ConversationList.vue'
import ConversationDetail from './components/conversation/ConversationDetail.vue'
import MessageItem from './components/conversation/MessageItem.vue'
import MessageList from './components/conversation/MessageList.vue'
import MessageForm from './components/conversation/MessageForm.vue'
import InvitationCard from './components/invitation/InvitationCard.vue'
import InvitationList from './components/invitation/InvitationList.vue'
import InvitationForm from './components/invitation/InvitationForm.vue'
import PageCard from './components/page/PageCard.vue'
import PageList from './components/page/PageList.vue'
import PageDetail from './components/page/PageDetail.vue'
import OfferCard from './components/joatu/OfferCard.vue'
import OfferList from './components/joatu/OfferList.vue'
import OfferForm from './components/joatu/OfferForm.vue'
import RequestCard from './components/joatu/RequestCard.vue'
import RequestList from './components/joatu/RequestList.vue'
import RequestForm from './components/joatu/RequestForm.vue'
import AgreementCard from './components/joatu/AgreementCard.vue'
import AgreementList from './components/joatu/AgreementList.vue'

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
export { useInvitations } from './composables/useInvitations'
export { usePages } from './composables/usePages'
export { useJoaTuOffers } from './composables/useJoaTuOffers'
export { useJoaTuRequests } from './composables/useJoaTuRequests'
export { useJoaTuAgreements } from './composables/useJoaTuAgreements'
export { useMembers } from './composables/useMembers'
export { useNotifications } from './composables/useNotifications'
export { useSyncStatus } from './composables/useSyncStatus'

export { getCevContext } from './context'
export { defineExtension } from './extension'
export { registerSlotInjection, getSlotInjections } from './slot-registry'
export { createCevI18n, installI18n, registerExtensionMessages } from './i18n'
export { useI18n } from 'vue-i18n'

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
  ConversationCard, ConversationList, ConversationDetail,
  MessageItem, MessageList, MessageForm,
  InvitationCard, InvitationList, InvitationForm,
  PageCard, PageList, PageDetail,
  OfferCard, OfferList, OfferForm,
  RequestCard, RequestList, RequestForm,
  AgreementCard, AgreementList,
}

library.add(faExternalLinkAlt)

const NAME = 'CommunityEngineVue'

const install = (app, options = {}) => {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
  app.component('BtNavUser', BtNavUser)
  app.component('BtUserNewPasswordForm', BtUserNewPasswordForm)
  app.component('ExtensionSlot', ExtensionSlot)

  // Install vue-i18n (merges into host app's i18n instance if one exists)
  installI18n(app, options)

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

  // Start Electric sync if configured (graceful no-op when VITE_ELECTRIC_URL unset)
  getDb().then(db => startSync(db)).catch(() => { /* Electric not configured */ })

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
  app.component('BtConversationCard', ConversationCard)
  app.component('BtMessageItem', MessageItem)
  app.component('BtInvitationCard', InvitationCard)
  app.component('BtPageCard', PageCard)
  app.component('BtOfferCard', OfferCard)
  app.component('BtRequestCard', RequestCard)
  app.component('BtAgreementCard', AgreementCard)
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
export { useInstallPrompt, useSwUpdate, getCevWorkboxConfig } from './pwa/index'
export default CommunityEngineVue
