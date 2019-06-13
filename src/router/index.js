/* jshint esversion: 6 */
import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/views/Login.vue'
import home from '@/home.vue'
// import user from '@/views/user/user.vue'
// import index from '@/views/index'
import wacthDetails from '@/views/watchdetails/index'

Vue.use(Router)

const _import = file => () => import(`@/views/${file}.vue`)

let routes = [
  {
    path: '/',
    name: 'index',
    component: _import('index')
  },
  {
    path: '/home',
    // redirect: { name: 'map' },
    component: home,
    children: [
      {
        path: '/watch-details',
        name: 'watchDetails',
        component: wacthDetails
      }
    ]
  }
]

const router = new Router({
  routes: routes
})

export default router
