import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import BtApp from './BtApp.vue'
import './registerServiceWorker'
import BtRouter from './router'
import BtStore from './store'

Vue.config.productionTip = false

new Vue({
  BtRouter,
  BtStore,
  render: (h) => h(BtApp),
}).$mount('#app')
