import 'babel-polyfill'
import Vue from 'vue'
import moment from 'moment'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import * as api from './store/api'
import router from './router'
import store from './store'
import filters from './filters/filters'
// import {mkTree} from './mk'
import promise from 'es6-promise'
import preview from 'vue-photo-preview'

promise.polyfill()

import './main.css'

import 'vue-photo-preview/dist/skin.css'
Vue.use(preview)
Vue.config.productionTip = false
Vue.use(ElementUI)

// 注册全局属性
Vue.prototype.$Vue = Vue
Vue.prototype.$api = api
Vue.prototype.$moment = moment

// 禁止浏览器后退按钮
// history.pushState(null, null, document.URL)
/* window.addEventListener('popstate', function () {
  history.pushState(null, null, document.URL)
}) */

for (let key in filters) {
  Vue.filter(key, filters[key])
}
// let permission = window.localStorage.getItem(config.storageKey.userToken)
// if (permission) {
//   let menu = mkTree(JSON.parse(window.localStorage.getItem('mks')))
//   let addRoutes = [{
//     path: '/home',
//     component: require('./home.vue'),
//     name: '',
//     isMenu: true,
//     children: menu
//   }]
//   router.addRoutes(addRoutes)
// } else {
  /* config.UserInfo = {}
  Vue.prototype.$alert('登录失效，请重新登录!!!', '提示', {
    confirmButtonText: '重新登录',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    center: true,
    type: 'warning',
    customClass: 'login_error',
    showClose: false
  }).then(() => {
    window.location.href = config.appUrl.waterSorceSystem
  }) */
// }
/* eslint-disable no-new */
const vueInstance = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {App}
})

export default vueInstance
