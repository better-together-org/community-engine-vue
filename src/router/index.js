import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import Me from '../pages/Me.vue'

// Auth guards are intentionally disabled. The pattern below of reading
// store.getters at module-load time is architecturally broken — the store
// is not yet reactive when this module is first imported. Re-enablement
// requires the guards to be rewritten as inline beforeEach callbacks that
// read store.getters at navigation time, not at module evaluation time.
// This is addressed in the Vue 3 migration where a Pinia-based approach
// will replace the current Vuex pattern.
//
// import store from '../store'
// const ensureAuthenticated = (to, from, next) => {
//   const isAuthenticated = store.getters['CommunityEngine/Authentication/isAuthenticated']
//   if (isAuthenticated) { next() }
//   else { next({ name: 'Sign In', query: { redirect_to: to.fullPath } }) }
// }

// const documentTitle = 'Better Together'

const setPageTitleAndMeta = (to, from, next) => {
  // This goes through the matched routes from last to first,
  // finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and
  // /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find((r) => r.meta && r.meta.title)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find((r) => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = `${nearestWithTitle.meta.title}`

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map((el) => el.parentNode.removeChild(el))

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef) => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach((key) => {
      tag.setAttribute(key, tagDef[key])
    })

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  })
  // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag))

  return next()
}

Vue.use(VueRouter)

const BtRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home',
      metaTags: [
        {
          name: 'description',
          content: 'The home page of our community.',
        },
        {
          property: 'og:description',
          content: 'The home page of our community.',
        },
      ],
    },
  },
  {
    path: '/me',
    name: 'Me',
    component: Me,
    meta: {
      title: 'Me',
      metaTags: [
        {
          name: 'description',
          content: 'My home page in our community.',
        },
        {
          property: 'og:description',
          content: 'My home page in our community.',
        },
      ],
    },
  },
  {
    path: '/users/sign-in',
    name: 'Sign In',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserSignIn.vue'),
  },
  {
    path: '/users/sign-up',
    name: 'Sign Up',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserSignUp.vue'),
  },
  {
    path: '/users/password/reset',
    name: 'Reset Password',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserPasswordReset.vue'),
    // beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/users/password/new',
    name: 'New Password',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserPasswordNew.vue'),
    props: (route) => ({ resetPasswordToken: route.query.reset_password_token }),
    // beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/users/confirmation/resend',
    name: 'Resend Account Confirmation',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserResendConfirmation.vue'),
    // beforeEnter: ifNotAuthenticated,
  },
  {
    path: '/users/confirmation',
    name: 'Account Confirmation',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/UserResendConfirmation.vue'),
    props: (route) => ({ confirmationToken: route.query.confirmation_token }),
    // beforeEnter: ifNotAuthenticated,
  },
  {
    path: '*',
    name: 'Error404',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "contact" */ '../pages/Error404.vue'),
  },
]

const routes = BtRoutes

const BtRouter = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

// This callback runs before every route change, including on page load.
BtRouter.beforeEach(setPageTitleAndMeta)

export { BtRoutes }

export default BtRouter
