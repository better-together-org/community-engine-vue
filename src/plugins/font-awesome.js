import { library } from '@fortawesome/fontawesome-svg-core'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faExternalLinkAlt)

export function setupFontAwesome(app) {
  app.component('FontAwesomeIcon', FontAwesomeIcon)
}
