/* eslint no-shadow: ["error", { "allow": ["state"] }] */

// import axios from 'axios'
import BtApiV1 from '../../endpoints/BtApiV1'

// initial state
const state = {
  activeCommunity: {},
  communities: [],
  platformCommunity: {
    id: 0,
    name: 'Better Together',
    description: 'A community buiding platform',
    customization: {
      backgroundColor: '#343a40 !important',
      coverImageUrl: '',
      coverImagePositionY: 'center',
      imageUrl: '',
    }
  },
}

state.activeCommunity = {
  ...state.platformCommunity,
}

// getters
const getters = {
  activeCommunity: (state) => state.activeCommunity,
  customization: (state) => state.activeCommunity.customization,
  coverImageUrl: (state) => state.activeCommunity.customization.coverImageUrl,
  coverImagePositionY: (state) => state.activeCommunity.customization.coverImagePositionY,
}

// actions
const actions = {
  setCoverImageUrl({ commit }, url) {
    return new Promise((resolve) => {
      commit('SET_COVER_IMAGE_URL', url)
      resolve(url)
    })
  },
  setCustomizationOptions({ commit }, options) {
    return new Promise((resolve) => {
      commit('SET_CUSTOMIZATION_OPTIONS', options)
      resolve(options)
    })
  },
  getCommunities({ commit }, params) {
    return new Promise((resolve, reject) => {
      BtApiV1.findAll('communities', { params }).then(({ data }) => {
        commit('SET_COMMUNITIES', data)
        resolve(data)
      })
        .catch(({ response }) => {
          reject(response)
        })
    })
  },
  postCommunity({ commit }, params) {
    return new Promise((resolve, reject) => {
      BtApiV1.create('community', params)
        .then(({ data }) => {
          commit('PREPEND_COMMUNITY', data)
          resolve(data)
        }).catch((response) => {
          reject(response)
        })
    })
  },
}

// mutations
const mutations = {
  SET_COMMUNITIES(currentState, communities) {
    currentState.communities = communities
  },
  SET_COVER_IMAGE_URL(currentState, url) {
    currentState.activeCommunity.customization.coverImageUrl = url
  },
  SET_CUSTOMIZATION_OPTIONS(currentState, options) {
    currentState.activeCommunity.customization = {
      ...currentState.platformCommunity.customization,
      ...options,
    }
  },
  PREPEND_COMMUNITY(currentState, community) {
    currentState.communities.unshift(community)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
