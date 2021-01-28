import BtNavUser from './components/BtNavUser.vue'

const NAME = 'CommunityEngineVue'

const install = (Vue) => {
  Vue.component('BtNavUser', BtNavUser)
}

// --- CommunityEngineVue plugin ---
const CommunityEngineVue = /* #__PURE__ */ {
  install,
  NAME,
}

console.log('Loading Community Engine')

export {
  install,
  NAME,
  CommunityEngineVue,
}

export { BtNavUser }

// Default export is the CommunityEngineVue plugin
export default CommunityEngineVue
