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
    redirect: { name: 'map' },
    component: home,
    children: [
      {
        path: '/watch-details',
        name: 'watchDetails',
        component: wacthDetails
      },
      {
        path: '/map',
        name: 'map',
        redirect: { name: 'suspectPaiKou' },
        component: _import('map/map'),
        children: [
          {
            path: '/suspectPaiKou',
            name: 'suspectPaiKou',
            component: _import('map/suspectPaiKou')
          },
          {
            path: '/theScreen',
            name: 'theScreen',
            component: _import('map/theScreen')
          }
        ]
      },
      {
        path: '/outlet/yOutlet',
        name: 'yOutlet',
        component: _import('outletScreen/yOutlet')
      },
      {
        path: '/outlet/pOutlet',
        name: 'pOutlet',
        component: _import('outletScreen/pOutlet')
      },
      {
        path: '/system/role',
        name: 'role',
        component: _import('system/role')
      },
      {
        path: '/system/user',
        name: 'user',
        component: _import('system/user')
      },
      {
        path: '/system/unit',
        name: 'unit',
        component: _import('system/unit')
      }
    ]
  }
  // {
  //   path: '/user',
  //   name: 'user',
  //   meta: {
  //     requireAuth: true  // 添加该字段，表示进入这个路由是需要登录的
  //   },
  //   component: user
  // }
]

const router = new Router({
  routes: routes
})

export default router
