<template>
  <div class="sydxc">
    <div class="header">
      <i>
        <img src="../static/images/header/logo-pwk.png" alt="" style="position: absolute;top: 14px;">
      </i>
      <span class="title">环渤海入海排污口排查支持系统</span>
      <div class="exit_button">
        <el-dropdown trigger="click" placement="bottom">
          <span class="el-dropdown-link">
            用户名 ( {{ userdetail.userName }} )<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exit"><i class="icfont iconfont icontuichu"></i><span class="tiptext">退出系统</span></el-dropdown-item>
            <el-dropdown-item @click.native="getuserInfo"><i class="icfont iconfont icongerenxinxi"></i><span class="tiptext">个人信息</span></el-dropdown-item>
            <el-dropdown-item @click.native="editorPassword = true"><i class="icfont iconfont iconxiugaimima"></i><span class="tiptext">修改密码</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="index-content-wrap">
      <index-nav class="nav_warp" :style="flag ? 'width:65px;' : 'width:210px;'"  @leftClose="leftClose" :menu=menu :activeName=activeName></index-nav>
      <div class="index-route" :style="flag === true ? 'left:65px; width:calc(100% - 65px);' : 'left:210px; width:calc(100% - 210px);' ">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <el-dialog
      title="个人信息"
      :visible.sync="editorUser"
      width="524px"
      v-loading="loading"
      center>
      <div class="userInfoItem">
        <span>用户名</span>
        <span>{{ userinfo.userName }}</span>
      </div >
      <div class="userInfoItem">
        <span>真实姓名</span>
        <el-input size="small" style="width: 208px" v-model="userinfo.realName" placeholder="请输入真实姓名"></el-input>
      </div>
      <div class="userInfoItem">
        <span>手机号</span>
        <el-input size="small" style="width: 208px" v-model="userinfo.phoneNum" placeholder="请输入手机号"></el-input>
      </div>
      <div class="userInfoItem">
        <span>用户单位</span>
        <span>{{ userinfo.jobUnit }}</span>
      </div>
      <div class="userInfoItem">
        <span>过期时间</span>
        <span>{{ userinfo.expirationtime }}</span>
      </div>
      <div class="userInfoItem">
        <span>角色权限</span>
        <span>{{ qx }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="editUser">确 定</el-button>
        <el-button size="small" @click="editorUser = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="editorPassword"
      width="424px"
      center>
      <div style="padding-left: 34px">
        <el-form :model="FormInfo" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
          <el-form-item style="font-size: 12px" label="原始密码" prop="oldPassword">
            <el-input type="password" size="small" style="width: 208px" v-model="FormInfo.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input type="password" size="small" style="width: 208px" v-model="FormInfo.newPassword"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input type="password" style="width: 208px" size="small" v-model="FormInfo.confirmPassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="ModifyPassword">确 定</el-button>
        <el-button size="small" @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import indexNav from './components/IndexNav'
  import * as api from './store/api'
  import md5 from 'js-md5'
  export default {
    data () {
      // 表单验证规则
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'))
        } else {
          if (!reg.test(value)) {
            callback(new Error('密码必须8-16位的数字和英文字符组合'))
          }
        }
        callback()
      }
      var validatePass1 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空'))
        } else {
          if (!reg.test(value)) {
            callback(new Error('密码必须8-16位的数字和英文字符组合'))
          }
          if (this.FormInfo.newPassword !== value) {
            callback(new Error('新旧密码不一致'))
          }
        }
        callback()
      }
      return {
        editorUser: false,
        editorPassword: false,
        userinfo: {},
        qx: '',
        loading: false,
        flag: false,
        userdetail: {},
        menu: [],
        activeName: '',
        FormInfo: {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        },
        // 表单验证规则
        rules: {
          oldPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, validator: validatePass1, trigger: 'blur' }
          ]
        }
      }
    },
    created () {
    },
    mounted () {
      this.menu = JSON.parse(localStorage.getItem('menu'))
      if (window.localStorage.getItem('userDetail')) {
        this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
      }
      if (this.$route.path === '/home' || this.$route.path === '/') {
        this.activeName = this.menu[0].name
        if (this.menu[0].children && this.menu[0].children.length > 0) {
          this.activeName = this.menu[0].children[0].name
        }
        return
      }
      let path = this.$route.fullPath.split('/')
      this.activeName = path[path.length - 1]
    },
    methods: {
      // 编辑用户信息 userEditUserInfoA
      editUser () {
        let args = {
          id: this.userdetail.userId,
          phoneNum: this.userinfo.phoneNum,
          realName: this.userinfo.realName
        }
        this.loading = true
        api.userEditUserInfoA(args).then(res => {
          if (res.data.c === 1) {
            this.loading = false
            this.editorUser = false
            return
          }
          this.loading = false
          this.editorUser = false
          this.$message.error('编辑失败')
        })
      },
      // userGetUserInfoByUserIdA
      getuserInfo () {
        this.editorUser = true
        this.loading = true
        api.userGetUserInfoByUserIdA(this.userdetail).then(res => {
          if (res.data.c === 1) {
            this.userinfo = res.data.r.data
            this.qx = this.userinfo.systemQxList.filter(el => el.systemtype === 3)[0].permissions
            this.loading = false
            return
          }
          this.loading = false
        })
      },
      // 取消
      cancel () {
        this.editorPassword = false
        this.FormInfo = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
        this.$refs.ruleForm.resetFields()
      },
      // 表单验证
      ModifyPassword () {
        // userSetUserA
        let args = {
          u: this.userdetail.userName,
          pw: md5(this.FormInfo.oldPassword),
          np: md5(this.FormInfo.newPassword),
          rp: md5(this.FormInfo.confirmPassword)
        }
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            api.userSetUserA(args).then(res => {
              if (res.data.c === 1) {
                // this.loading = false
                // this.editorUser = false
                return
              }
              this.loading = false
              this.editorUser = false
              this.$message.error('修改失败')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      exit () {
        api.signOut(this.userdetail).then(res => {
          if (res.data.c === 1) {
            // window.location.href = config.appUrl.waterSorceSystem + '/system'
          }
        })
      },
      leftClose (i) {
        this.flag = i
      }
    },
    computed: {
    },
    watch: {
    },
    components: {
      indexNav
    }
  }
</script>

<style lang="scss" type="text/scss">
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  .el-form-item__label {
    font-size: 12px;
  }
  .sydxc {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .header {
      width: 100%;
      height: 58px;
      line-height: 58px;
      background: #1c8ffa;
      position: absolute;
      top: 0;
      z-index: 1;
      padding-left: 20px;
      box-shadow: 2px 2px 4px rgba(15, 21, 53, 0.22);
      .title {
        margin-left: 36px;
        font-family: $fontFamily;
        font-size: 20px;
        color: #fff;
      }
      .exit_button {
        float: right;
        color:#fff;
        padding: 5px 10px;
        box-sizing: border-box;
        height: 58px;
        line-height: 48px;
        margin-right: 14px;
        position: relative;
        font-size: 14px;
        span{
          cursor: pointer;
        }
        .el-dropdown {
          display: inline-block;
          position: relative;
          color: white;
          font-size: 14px;
        }
      }
    }
    .index-content-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 58px;
      bottom: 0;
      background: #fff;
      overflow: hidden;
      z-index: 1;
      .nav_warp {
        text-align: left;
        position: absolute;
        width: 210px;
        top: 0;
        left: 0;
        height: calc(100%);
        background-color: #1a202a;
      }
      .index-route {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 210px;
        width: calc(100% - 210px);
      }
    }
  }
  .login_error {
    width: 100%;
    height: 100%;
  }
  .el-table th {
    background: #e4ebf3;
  }
  .userInfoItem{
    padding-left: 103px;
    margin-bottom: 16px;
    span{
      font-size: 12px;
      display: inline-block;
      &:first-child{
        width: 64px;
      }
    }
  }
  .tiptext{
    margin-left: 10px;
  }
</style>

