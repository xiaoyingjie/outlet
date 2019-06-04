index<template>
  <div class="userSetting">
    <div class="userHead">
        <span class="userName">
          用户设置 <span>({{userdetail.rn}})</span>
        </span>
    </div>
    <div class="userWrap">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
        <el-form-item prop="n" label="姓名 :">
          <el-input v-model="form.n" placeholder="姓名"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="p" label="手机号码 :">
          <el-input name="type" v-model="form.p" auto-complete="off" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="pw" label="原密码 :">
          <el-input type="password" v-model="form.pw" placeholder="请输入原密码"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="np" label="新密码 :">
          <el-input type="password" v-model="form.np" placeholder="请输入新密码"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="rp" label="确认新密码 :">
          <el-input type="password" v-model="form.rp" placeholder="请再次输入密码"
                    auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="btns">
        <span class="sure" @click="submitForm()">确 认</span>
        <span class="cancel" v-if="userdetail.passWord ==='000000'" @click="tishi">取 消</span>
        <span class="cancel" v-show="qxShow"  @click="cancel">取 消</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss" type="text/scss">
  $font: "Microsoft YaHei!important";
  $fonts: "SimHei!important";
  $fontFam: "宋体";
  .userSetting {
    top: 59px;
    width: 100%;
    height: calc(100% - 59px);
    background: #fff;
    position: absolute;
    left: 0;
    z-index: 2;
    .userHead {
      width: calc(100% - 59px);
      margin: 0 auto;
      height: 94px;
      border-bottom: 1px dashed #d7d7d7;
      text-align: center;
      .userName {
        margin-top: 55px;
        font-size: 18px;
        font-family: $font;
        color: #2f81eb;
        display: inline-block;
        span {
          font-size: 14px;
          color: #7e8485;
          font-family: $fonts;
        }
      }
    }
    .userWrap {
      height: calc(100% - 95px);
      .el-form-item {
        width: 400px;
        margin: 30px auto 0 auto;
        .el-form-item__content {
          .el-input {
            width: 298px;
            height: 34px;
            border-radius: 4px;
            margin-left: 8px;
            .el-input__inner {
              border: 1px solid #d7d7d7 !important;
              font-size: 14px;
              font-family: $font;
              color: #000;
              &:focus {
                border-color: #2f81eb !important;
              }
            }
            ::-webkit-input-placeholder { /* WebKit browsers */
              font-size: 14px !important;
              font-family: $fontFam !important;
              color: #ccc !important;
            }
            :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
              font-size: 14px !important;
              font-family: $fontFam !important;
              color: #ccc !important;
            }
            ::-moz-placeholder { /* Mozilla Firefox 19+ */
              font-size: 14px !important;
              font-family: $fontFam !important;
              color: #ccc !important;
            }
            :-ms-input-placeholder { /* Internet Explorer 10+ */
              font-size: 14px !important;
              font-family: $fontFam !important;
              color: #ccc !important;
            }
          }
          .el-form-item__error {
            left: 10px !important;
            font-family: $fontFam;
            font-size: 12px;
            color: #e34c1a;
          }
        }
      }
      .btns{
        width: 450px;
        text-align: center;
        margin: 40px auto;
        span{
          display: inline-block;
          width: 130px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          font-family: $font;
          border-radius: 4px;
          border: 1px solid;
          cursor: pointer;
        }
        .sure{
          color: #fff;
          border-color: #2f81eb;
          background: #2f81eb;
          margin-left: 113px;
          &:hover{
            color: #215aa4;
          }
        }
        .cancel{
          margin-left: 28px;
          color: #9e9e9e;
          border-color: #dbdee0;
          background: #f6f6f6;
          &:hover{
            color: #215aa4;
          }
        }
      }
    }
  }

  .el-form-item__label {
    height: 36px!important;
    font-size: 14px !important;
    color: #464646 !important;
    font-family: $font;
    line-height: 36px!important;
    padding: 0!important;
  }
</style>
<script>
  import * as api from '../../store/api'
  import md5 from 'js-md5'
  export default {
    data () {
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名'))
        } else {
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入原密码'))
        } else {
          callback()
          let self = this
          clearTimeout(this.timer)
          if (self.form.pw === '') {
            return
          }
          /* self.timer = setTimeout(() => {
            this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
            let params = {
              pw: md5(self.form.pw),
              u: self.userdetail.userName
            }
            api.verifyUser(params).then(res => {
              // 提示信息
              if (res.data.m === '与原密码相符') {
                self.form.oldpw = self.userdetail.u
                callback()
              } else {
                callback(new Error('输入的密码与原密码不符'))
              }
            })
          }, 1000) */
        }
      }
      var validatePass2 = (rule, value, callback) => {
        let reg = /^(\d|[a-zA-Z])*((\d[a-zA-Z])|([a-zA-Z]\d))(\d|[a-zA-Z])*$/
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else if (value === this.form.pw) {
          callback('该密码与原密码相同，请重新输入！')
        } else if (!reg.test(value)) {
          callback(new Error('密码需要包含数字和英文字母'))
        } else {
          callback()
        }
      }
      var validatePass3 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入新密码'))
        } else if (value !== this.form.np) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        var myreg = /^1(3|4|5|6|7|8)\d{9}$/
        if (value === '') {
          callback(new Error('手机号码不能为空'))
        } else if (!myreg.test(value)) {
          callback(new Error('手机号码格式不正确'))
        } else {
          callback()
        }
      }
      return {
        qxShow: false,
        userdetail: '',
        timer: '',
        // oldpw: '', // 原密码
        msg: '',
        form: {
          pw: '',
          np: '',
          p: '',
          rp: '',
          u: '',
          // oldpw: '',
          n: ''
        },
        rules: {
          n: [
            {validator: validateName, trigger: 'blur'}
          ],
          pw: [
            {validator: validatePass, trigger: 'blur'}
          ],
          np: [
            {validator: validatePass2, trigger: 'blur'}
          ],
          p: [
            {type: 'Number', validator: validatePhone, trigger: 'blur'}
          ],
          rp: [
            {validator: validatePass3, trigger: 'blur'}
          ]
        }
      }
    },
    watch: {
      'form.pw': function (v, ov) {
      },
      'userdetail.passWord' (v, ov) {
        if (v !== '000000') {
          this.qxShow = true
        }
      }
    },
    mounted () {
      this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
      this.form.p = this.userdetail.pn
      this.form.n = this.userdetail.rn
    },
    methods: {
      submitForm () {
        // 表单验证方法
        let self = this
        self.$refs.form.validate(function (result) {
          if (result) {
            self.form.u = self.userdetail.userName
            self.form.pw = md5(self.form.pw)
            self.form.np = md5(self.form.np)
            self.form.rp = md5(self.form.rp)
            api.setUser(self.form).then(res => {
              if (res.data.m === '请求成功') {
                self.form = {}
                self.$message({
                  message: '修改成功',
                  type: 'success'
                })
                setTimeout(() => {
                  self.$router.push({
                    path: '/login'
                  })
                }, 3000)
              } else {
                self.$message.error(res.data.m)
              }
            })
          } else {
            return false
          }
        })
      },
      cancel () {
        window.history.go(-1)
      },
      tishi () {
        this.$router.push({
          path: '/home/search'
        })
      }
    }
  }
</script>
