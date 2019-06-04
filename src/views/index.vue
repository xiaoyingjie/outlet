<template>
  <div></div>
</template>

<script>
import { mkTree } from '../mk'
import md5 from 'js-md5'
import { setLocalStorage } from '../assets/js/util/utils'
import * as api from '../store/api'
export default {
  data () {
    return {
      mks: [],
      userInfo: {}
    }
  },
  created () {
    // 超级管理员
    this.getSystemDetail('system', '123456', 'rhk')
    // 许琴 管理员
    // this.getSystemDetail('18979100365', '123456', 'rhk')
    // 张磊 数据采集员 督查账号
    // this.getSystemDetail('zhanglei', '123456', 'rhk')
  },
  mounted () {
    // this.getLocalStorage ()
  },
  methods: {
    getLocalStorage () {
      this.userInfo = JSON.parse(window.localStorage.getItem(config.storageKey.userInfo))
      if (this.userInfo) {
        config.UserInfo = this.userInfo
        this.setUserDetail(this.userInfo)
        if (window.localStorage.getItem('mks')) {
          this.mks = JSON.parse(window.localStorage.getItem('mks'))
          this.checkJs(this.mks)
        }
      }
    },
    checkJs (mks) {
      let menu = mkTree(mks)
      window.localStorage.setItem('mks', JSON.stringify(mks))
      window.localStorage.setItem('menu', JSON.stringify(menu))
      let addRoutes = [{
        path: '/home',
        component: require('../home.vue'),
        name: '',
        isMenu: true,
        children: menu
      }]
      this.$router.addRoutes(addRoutes)
      this.$router.push({path: '/home'})
    },
    setUserDetail (userInfo) {
      let userDetail = {
        userId: userInfo.ui,
        userName: userInfo.un,
        pn: userInfo.pn,
        ia: userInfo.ia,
        dwbm: userInfo.dc,
        dwmc: userInfo.dn,
        token: userInfo.tk,
        c: userInfo.c,
        rn: userInfo.rn,
        systemQxList: userInfo.systemQxList
      }
      window.localStorage.setItem('userDetail', JSON.stringify(userDetail))
      window.sessionStorage.setItem('to', userDetail.token)
      window.sessionStorage.setItem('un', userDetail.userName)
    },
    getSystemDetail (u, p, iconname) {
      window.localStorage.clear()
      let params = {
        u: u,
        p: md5(p)
      }
      api.signIn(params).then(res => {
        if (res.data.c === 1 && res.data.m === '请求成功') {
          setLocalStorage(config.storageKey.userInfo, res.data.r.userInfo)
          setLocalStorage(config.storageKey.userToken, res.data.r.userInfo.tk)
          let item = res.data.r.userInfo.systemQxList.filter(item => item.iconname === iconname)[0]
          setLocalStorage('systemItem', item)
          api.getRoleMoudleListNew(item.roleid).then(res => {
            if (res.data.r && res.data.r.data && res.data.r.data[0] && res.data.r.data[0].zj) {
              setLocalStorage('mks', res.data.r.data)
              this.getLocalStorage()
            } else {
              window.localStorage.clear()
              this.$message({message: '该用户目前无该系统角色，请联系系统管理员分配角色权限!', type: 'error'})
            }
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message({message: '登录异常', type: 'warning', duration: 1000})
      })
    }
  }
}
</script>

<style>

</style>
