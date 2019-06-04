// import Vue from 'vue'
import {JWD} from '../mutation-types'
const state = {
  jwd: false
}

// getters
const getters = {
  jwd: state => state.jwd
}

// mutations
const mutations = {
  [JWD] (state, user) {
    state.jwd = user
  }
}

// actions
const actions = {
  [JWD] ({commit}, data) {
    commit('JWD', data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
