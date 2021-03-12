/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// import axios from 'axios'
// import BtApiV1 from '../../endpoints/BtApiV1'

// initial state
const state = {
  header: {
    id: 0,
    menuItems: [
      {
        id: 0,
        path: '/',
        label: 'Home',
        title: 'Home',
        url: '#',
        external: false,
        sortOrder: 0,
      },
    ],
  },
}

// getters
const getters = {
  headerMenuItems: (state) => state.header.menuItems,
}

// actions
const actions = {
  setHeaderMenuItems({ commit }, menuItems) {
    return new Promise((resolve) => {
      commit('SET_HEADER_MENU_ITEMS', menuItems)
      resolve(menuItems)
    })
  },
}

// mutations
const mutations = {
  SET_HEADER_MENU_ITEMS(currentState, menuItems) {
    currentState.header.menuItems = menuItems
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
