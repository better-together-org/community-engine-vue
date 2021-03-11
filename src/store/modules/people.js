/* eslint no-shadow: ["error", { "allow": ["state"] }] */
import axios from 'axios'

// initial state
const state = {
  // people: [],
  currentPerson: {},
  me: {},
}

// getters
const getters = {
  hasCurrentPerson: (state) => Object.keys(state.currentPerson).length > 0,
  hasMe: (state) => Object.keys(state.me).length > 0,
  currentPerson: (state) => state.currentPerson,
  me: (state) => state.me,
  currentPersonChanged: (state) => JSON.stringify(state.currentPerson) !== JSON.stringify(state.me),
}

// actions
const actions = {
  // getPeople({ commit }, params) {
  //   return new Promise((resolve, reject) => {
  //     BtApiV1.findAll('people', { params }).then(({ data }) => {
  //       commit('SET_PEOPLE', data)
  //       resolve(data)
  //     })
  //       .catch(({ response }) => {
  //         reject(response)
  //       })
  //   })
  // },
  postPerson({ commit }, params) {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.VUE_APP_BETTER_TOGETHER_API_URI}/bt/api/v1/people/me`, params)
        .then(({ data }) => {
          commit('PREPEND_PERSON', data)
          resolve(data)
        }).catch((response) => {
          reject(response)
        })
    })
  },
  getMe({ commit }) {
    return new Promise((resolve, reject) => {
      axios.get(`${process.env.VUE_APP_BETTER_TOGETHER_API_URI}/bt/api/v1/people/me`)
        .then((response) => {
          let person = {}
          if (response.status === 200) {
            person = response.data
          }

          commit('SET_CURRENT_PERSON', { ...person })
          commit('SET_ME', person)
          resolve(response)
        }).catch((response) => {
          reject(response)
        })
    })
  },
}

// mutations
const mutations = {
  SET_CURRENT_PERSON(currentState, person) {
    currentState.currentPerson = person
  },
  SET_ME(currentState, person) {
    currentState.me = person
  },
  CLEAR_CURRENT_PERSON(currentState) {
    currentState.currentPerson = {}
  },
  // SET_PEOPLE(currentState, people) {
  //   currentState.people = people
  // },
  // PREPEND_PERSON(currentState, community) {
  //   currentState.people.unshift(community)
  // },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
