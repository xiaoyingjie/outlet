import Vue from 'vue'
import Vuex from 'vuex'
import VuexAlong from 'vuex-along'
import signIn from './modules/signIn'
import map from './modules/map'
import system from './modules/system'
import home from './modules/home'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    signIn,
    map,
    system,
    home
  },
  plugins: [VuexAlong]
})
