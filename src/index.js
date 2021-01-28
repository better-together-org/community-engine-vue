import BtApp from './BtApp.vue'

const NAME = 'CommunityEngineVue'

const install(Vue) {
  // Vue.component('BtApp', BtApp)
}

// --- CommunityEngineVue plugin ---
const CommunityEngineVue = /*#__PURE__*/ {
  install,
  NAME
}

console.log('test')

export {
  install,
  NAME,
  CommunityEngineVue
}

export { BtNavUser } from './components/BtNavUser'

// Default export is the CommunityEngineVue plugin
export default CommunityEngineVue
