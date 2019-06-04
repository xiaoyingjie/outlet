<template>
  <div class="login">
    <div class="loginBox">
      <div class="head">
        <span>生态环境执法技术支持系统</span>
      </div>
      <div class="conBox">
        <div class="loginWrap">
          <div class="loginWrapHeader">
            用户登录
          </div>
          <div class="loginInfo">
            <div class="loginUserName" :style="{'border-color': flagUn? '#3384e9' : '#d7d7d7'}">
              <span class="tx iconfont icon-yonghu" :style="{'color': flagUn? '#aad1ff' : '#ccc'}"></span>
              <input @keyup.enter="loginIn" auto-complete="off" v-model="form.userName" @focus="getFocus(1)" @blur="leaveFocus(1)"
                     class="insertUser" type="text" placeholder="请输入用户名">
              <span v-show="form.userName" @click="clear(1)" class="iconfont icon-guanbishuru guanbi"></span>
            </div>
            <div class="loginUserName" :style="{'border-color': flagPW? '#3384e9' : '#d7d7d7'}">
              <span class="tx iconfont icon-mima" :style="{'color': flagPW? '#aad1ff' : '#ccc'}"></span>
              <input @keyup.enter="loginIn" auto-complete="off" v-model="form.passWord" @focus="getFocus(2)" @blur="leaveFocus(2)"
                     class="insertUser" type="password" placeholder="请输入密码">
              <span v-show="form.passWord" @click="clear(2)" class="iconfont icon-guanbishuru guanbi"></span>
            </div>
            <span class="message"></span>
            <input v-model="form.isRemeberPwd" class="selectBox" type="checkbox" id="forget"><label class="remember" for="forget">记住密码</label>
            <span class="errorTitle">{{titles}}</span>
            <div class="btnWrap">
              <span @click="loginIn" class="btn">登 录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="download">
      <img src="static/images/download.png" alt="">
    </div>
  </div>
</template>
<style lang="scss" type="text/scss">
  $fontFamily: "Microsoft YaHei";
  $fontFamilys: "SimSun";
  .login {
    width: 100%;
    height: 100%;
    background: #040E31;
    position: relative;
    .loginBox {
      width: 1200px;
      height: 630px;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
      .head {
        height: 64px;
        line-height: 64px;
        text-align: center;
        span {
          display: inline-block;
          height: 64px;
          font-size: 30px;
          font-family: "黑体";
          opacity: 0.8;
          color: #8bbfff;
          padding: 0 20px;
          background: url("../../static/images/background_03.png") no-repeat 0 0,
          url("../../static/images/background_07.png") no-repeat 100% 100%;
        }
      }
      .conBox {
        height: calc(100% - 64px);
        background: url("../../static/images/background_11.png") no-repeat 0 43px;
        position: relative;
        .loginWrap {
          width: 360px;
          height: 330px;
          background: #fff;
          border-radius: 5px;
          position: absolute;
          top: 50%;
          margin-top: -165px;
          right: 95px;
          .loginWrapHeader {
            height: 49px;
            line-height: 56px;
            padding-left: 56px;
            border-bottom: 1px solid #efefef;
            font-size: 16px;
            font-family: $fontFamily;
          }
          .loginInfo {
            height: calc(100% - 97px);
            .loginUserName {
              margin: 0 auto;
              width: 246px;
              height: 40px;
              line-height: 40px;
              border: 1px solid;
              border-radius: 4px;
              &:nth-child(1) {
                margin: 38px auto 20px auto;
              }
              &:nth-child(2) {
                margin-bottom: 15px;
              }
              .tx {
                margin: 0 5px 0 12px;
                font-size: 16px;
              }
              .insertUser {
                width: 180px;
                height: 34px;
                font-size: 13px;
                color: #000;
                font-family: $fontFamily;
                ::-webkit-input-placeholder { /* WebKit browsers */
                  font-size: 14px;
                  font-family: $fontFamilys;
                  color: #ccc;
                }
                :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
                  font-size: 14px;
                  font-family: $fontFamilys;
                  color: #ccc;
                }
                ::-moz-placeholder { /* Mozilla Firefox 19+ */
                  font-size: 14px;
                  font-family: $fontFamilys;
                  color: #ccc;
                }
                :-ms-input-placeholder { /* Internet Explorer 10+ */
                  font-size: 14px;
                  font-family: $fontFamilys;
                  color: #ccc;
                }
              }
              .guanbi {
                cursor: pointer;
                font-size: 14px;
                color: #ddd;
                &:hover {
                  color: #aad1ff;
                }
              }
            }
            .selectBox {
              margin: 0 5px 0 54px;
              vertical-align: middle;
            }
            label {
              font-size: 12px;
              color: #666;
              font-family: $fontFamilys;
              cursor: pointer;
            }
            .errorTitle{
              font-size: 12px;
              color: #ff0000;
              float: right;
              margin-right: 55px;
            }
            .btnWrap {
              text-align: center;
              .btn {
                font-family: "SimHei";
                width: 248px;
                margin-top: 10px;
                height: 40px;
                line-height: 40px;
                background: #3384e9;
                border-radius: 4px;
                text-align: center;
                color: #fff;
                font-size: 18px;
                display: inline-block;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .download{
      position: absolute;
      left: 40px;
      bottom: 40px
    }
  }
</style>
<script>
  import {cookies} from '../assets/js/util/utils'
  // import { mkTree } from '../mk'
  // import * as api from '../store/api'
  // import md5 from 'js-md5'
  // import axios from 'axios'
  export default{
    data () {
      return {
        form: {
          userName: '',
          passWord: '',
          isRemeberPwd: false
        },
        token: 'token',
        flagUn: false,
        flagPW: false,
        titles: ''
      }
    },
    mounted () {
      this.form.userName = cookies.get('username')
      this.form.passWord = cookies.get('passWord')
      this.form.isRemeberPwd = Boolean(cookies.get('isremeberpwd'))
    },
    methods: {
      /* checkJs (mks) {
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
        if (this.form.passWord === '000000') {
          this.$router.push({path: '/user'})
          this.$message({message: '请修改初始密码', type: 'error'})
        } else {
          this.$router.push({path: '/home'})
        }
      }, */
      getFocus (num) {
        if (num === 1) {
          this.flagUn = true
        } else {
          this.flagPW = true
        }
      },
      leaveFocus (num) {
        if (num === 1) {
          this.flagUn = false
        } else {
          this.flagPW = false
        }
      },
      clear (num) {
        if (num === 1) {
          this.form.userName = ''
          this.titles = ''
        } else {
          this.form.passWord = ''
          this.titles = ''
        }
      },
      loginIn () {
        this.$router.push({path: '/home'})
        window.sessionStorage.setItem('un', 'system')
        // if (this.form.userName && this.form.passWord) {
        //   if (this.form.isRemeberPwd) {
        //     this.form.isRemeberPwd = 1
        //     cookies.set('isremeberpwd', true)
        //     cookies.set('passWord', this.form.passWord, 3)
        //     cookies.set('username', this.form.userName, 3)
        //   } else {
        //     this.form.isRemeberPwd = 0
        //     cookies.delete('passWord')
        //     cookies.delete('username')
        //     cookies.delete('isremeberpwd')
        //   }
        //   let params = {
        //     u: this.form.userName,
        //     p: md5(this.form.passWord)
        //   }
        //   api.signIn(params).then(res => {
        //     if (res.data.c === 1 && res.data.m === '请求成功') {
        //       window.localStorage.setItem('c', res.data.r.userInfo.c)
        //       let userDetail = {
        //         rn: res.data.r.userInfo.rn,
        //         userId: res.data.r.userInfo.ui,
        //         userName: res.data.r.userInfo.un,
        //         userPwd: params.userPwd,
        //         passWord: this.form.passWord,
        //         dwmc: res.data.r.userInfo.dn,
        //         dwbm: res.data.r.userInfo.dc,
        //         token: res.data.r.userInfo.tk,
        //         ia: res.data.r.userInfo.ia,
        //         pn: res.data.r.userInfo.pn,
        //         c: res.data.r.userInfo.c,
        //         roleId: res.data.r.userInfo.roleId,
        //         systemQxList: res.data.r.userInfo.systemQxList
        //       }
        //       window.localStorage.setItem('userDetail', JSON.stringify(userDetail))
        //       Object.assign(axios.defaults.headers, {'userName': res.data.r.userInfo.un, 'token': res.data.r.userInfo.tk})
        //       window.sessionStorage.setItem('to', userDetail.token)
        //       window.sessionStorage.setItem('un', userDetail.userName)
        //       // 行政区划
        //       api.getXzqh(userDetail.userId).then(res => {
        //         if (res.status === 200 && res.data.c === 1 && res.data.r) {
        //           this.options = res.data.r.xzqh
        //           if (this.options.length !== 0) {
        //             window.sessionStorage.setItem('ctOptions', JSON.stringify(res.data.r.xzqh))
        //           }
        //         }
        //       })
        //       if (this.form.passWord === '000000') {
        //         this.$router.push({path: '/user'})
        //         this.$message({message: '请修改初始密码', type: 'error'})
        //       } else {
        //         this.$router.push({path: '/systemPage'})
        //       }

              // 菜单权限控制
              // api.getRoleMoudleListNew('21fdce40b5814f5ebc20dae4da35c75a').then(res => {
              // api.getRoleMoudleListNew(userDetail.roleId).then(res => {
              //   if (res.data.r && res.data.r.data) {
              //     this.checkJs(res.data.r.data)
              //   } else {
              //     this.$confirm('该用户目前无角色，请联系系统管理员分配角色权限!', '提示', {
              //       confirmButtonText: '确定',
              //       showCancelButton: false,
              //       type: 'warning'
              //     })
              //     let addRoutes = [{
              //       path: '/home',
              //       component: require('../home.vue'),
              //       name: ''
              //     }]
              //     this.$router.addRoutes(addRoutes)
              //     // if (this.form.passWord === '000000') {
              //     //   this.$router.push({path: '/user'})
              //     //   this.$message({message: '请修改初始密码', type: 'error'})
              //     // } else {
              //     //   this.$router.push({path: '/systemPage'})
              //     // }
              //   }
              // })
      //       } else {
      //         this.titles = '用户名或密码错误'
      //       }
      //     })
      //   } else {
      //     this.titles = '请输入用户名和密码'
      //   }
      }
    },
    components: {}
  }
</script>

