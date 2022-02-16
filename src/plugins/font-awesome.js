import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default {
  install: () => {
    library.add(faExternalLinkAlt)
    Vue.component('FontAwesomeIcon', FontAwesomeIcon)
  },
}
