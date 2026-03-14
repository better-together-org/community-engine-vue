import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../pages/Home.vue'
import Me from '../pages/Me.vue'

const setPageTitleAndMeta = (to) => {
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title)
  const nearestWithMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags)

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).forEach((el) => el.parentNode.removeChild(el))

  if (!nearestWithMeta) return

  nearestWithMeta.meta.metaTags.map((tagDef) => {
    const tag = document.createElement('meta')
    Object.keys(tagDef).forEach((key) => tag.setAttribute(key, tagDef[key]))
    tag.setAttribute('data-vue-router-controlled', '')
    return tag
  }).forEach((tag) => document.head.appendChild(tag))
}

export const BtRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home', metaTags: [{ name: 'description', content: 'The home page of our community.' }, { property: 'og:description', content: 'The home page of our community.' }] },
  },
  {
    path: '/me',
    name: 'Me',
    component: Me,
    meta: { requiresAuth: true, title: 'Me', metaTags: [{ name: 'description', content: 'My home page in our community.' }] },
  },
  { path: '/users/sign-in', name: 'Sign In', component: () => import('../pages/UserSignIn.vue') },
  { path: '/users/sign-up', name: 'Sign Up', component: () => import('../pages/UserSignUp.vue') },
  { path: '/users/password/reset', name: 'Reset Password', component: () => import('../pages/UserPasswordReset.vue') },
  {
    path: '/users/password/new',
    name: 'New Password',
    component: () => import('../pages/UserPasswordNew.vue'),
    props: (route) => ({ resetPasswordToken: route.query.reset_password_token }),
  },
  { path: '/users/confirmation/resend', name: 'Resend Account Confirmation', component: () => import('../pages/UserResendConfirmation.vue') },
  {
    path: '/users/confirmation',
    name: 'Account Confirmation',
    component: () => import('../pages/UserResendConfirmation.vue'),
    props: (route) => ({ confirmationToken: route.query.confirmation_token }),
  },
  { path: '/:pathMatch(.*)*', name: 'Error404', component: () => import('../pages/Error404.vue') },
]

const BtRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: BtRoutes,
})

BtRouter.beforeEach((to) => {
  setPageTitleAndMeta(to)
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Sign In', query: { redirect_to: to.fullPath } }
  }
})

export default BtRouter
