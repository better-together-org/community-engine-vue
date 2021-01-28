import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import SecureLS from 'secure-ls'
import CommunityEngine from './modules/community-engine'

const ls = new SecureLS({ isCompression: false })

Vue.use(Vuex)

const BtStoreModules = {
  CommunityEngine,
}

const BtStorePlugins = [
  createPersistedState({
    storage: {
      getItem: (key) => ls.get(key),
      setItem: (key, value) => ls.set(key, value),
      removeItem: (key) => ls.remove(key),
    },
  }),
]

const BtStore = new Vuex.Store({
  modules: BtStoreModules,
  plugins: BtStorePlugins,
})

export { BtStoreModules, BtStorePlugins }

export default BtStore
