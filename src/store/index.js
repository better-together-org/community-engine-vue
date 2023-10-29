import Vue from 'vue'
import Vuex from 'vuex'
import CommunityEngine from './modules/community-engine'

Vue.use(Vuex)

const BtStoreModules = {
  CommunityEngine,
}

const BtStorePlugins = []

const BtStore = new Vuex.Store({
  modules: BtStoreModules,
  plugins: BtStorePlugins,
})

export { BtStoreModules, BtStorePlugins }

export default BtStore
