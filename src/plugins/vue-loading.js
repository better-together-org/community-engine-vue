import axios from 'axios'
import Vue from 'vue'
import VueLoading from 'crip-vue-loading'

export default {
  install: () => {
    Vue.use(VueLoading, {
      axios,
      applyOnRouter: true,
      color: '#42b983',
      height: '3px',
    })
  },
}
