import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../pages/Home.vue'),
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
