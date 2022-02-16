import Authentication from './authentication'
import Communities from './communities'
import Menus from './menus'
import People from './people'
import CommunityEnginePackage from '../../../package.json'

const state = {
  version: CommunityEnginePackage.version,
}

const getters = {
  version: (engineState) => engineState.version,
}

const CommunityEngine = {
  state,
  getters,
}

export default {
  namespaced: true,
  modules: {
    CommunityEngine,
    Authentication,
    Communities,
    Menus,
    People,
  },
}
