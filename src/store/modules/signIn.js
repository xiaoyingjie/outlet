// import Vue from 'vue'
import {USER_SIGNIN, USER_SIGNOUT} from '../mutation-types'
const state = {
  user: {}
}

// getters
const getters = {
  user: state => state.user
}

// mutations
const mutations = {
  [USER_SIGNIN] (state, user) {
    state.user = user
    window.localStorage.setItem('userDetail', JSON.stringify(state.user))
  },
  [USER_SIGNOUT] (state) {
    state.user.token = ''
    state.user.userId = ''
    state.user.userName = ''
    window.localStorage.setItem('userDetail', '')
  }
}

// actions
const actions = {
  userSignin ({commit}, user) {
    commit(USER_SIGNIN, user)
  },
  userSignout ({commit}, user) {
    commit(USER_SIGNOUT, user)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
