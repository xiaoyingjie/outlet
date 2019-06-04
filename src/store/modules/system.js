import {SET_DEPT, SEARCH_STR} from '../mutation-types'
const state = {
  dept: {} // 单位字段
}

// getters
const getters = {
}

// mutations
const mutations = {
  // 部门字段
  [SET_DEPT] (state, data) {
    state.dept = data
  },
  // 模糊查询
  [SEARCH_STR] (state, data) {
    state.searchStr = data
  }
}

// actions
const actions = {
  [SEARCH_STR] ({commit}, data) {
    commit('SEARCH_STR', data)
  },
  [SET_DEPT] ({commit}, data) {
    commit('SET_DEPT', data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
