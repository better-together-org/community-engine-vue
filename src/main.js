import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import BtApp from './BtApp.vue'
import './plugins/'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(BtApp),
}).$mount('#app')
