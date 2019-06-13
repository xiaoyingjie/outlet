<template>
  <div class="map-screen" style="z-index:1;width: 345px;right: 0;">
    <div class="map-screen-header">
      <span @click="hideAdd" class="go-back" style="posttion: absolute;left:0;">
        <span class="iconfont icon-later"></span>
      </span>
      <div class="map-screen-header-title" style="posttion: absolute;right:0;">
        <span style>
          <i class="iconfont icon-bianji icon" style="padding-right: 6px"></i>
          <template v-if="isAdd">用户添加</template>
          <template v-else>用户修改</template>
        </span>
      </div>
    </div>
    <div
      class="map-screen-seach"
      style="height: calc(100% - 101px);margin-top: 10px"
      v-loading="loading"
    >
      <div class="info-layout" style="overflow-x: hidden;overflow-y: auto;">
        <div class="detail basicDetail" slot="form">
          <div style="position: relative;width: 100%;margin: 20px auto">
            <div class="detail-form basic-form">
              <el-form :model="form" :rules="rules" class="demo-ruleForm" ref="form">
                <div>
                  <span class="historyProblemWrap-title">&nbsp;&nbsp;&nbsp;&nbsp;用户基本设置</span>
                </div>
                <el-form-item label="工作单位 : " prop="ju">
                  &nbsp;
                  <input type="hidden" v-model="dept.ju">
                  <input type="hidden" v-model="form.ju">
                  {{form.ju}}
                  <span v-if="!form.ju">{{dept.n}}</span>
                </el-form-item>
                <el-form-item class="yhm" label="用户名 : " prop="un">
                  <!-- 编辑 -->
                  <el-input style="width: 200px" :disabled="true" class="noShuRu" v-if="!isAdd" v-model="form.un"></el-input>
                  <!-- 添加 -->
                  <el-input style="width: 200px" @change="yanZ" v-if="isAdd" v-model="form.un"></el-input>
                  <span class="errorTitle" v-if="isUsed && isAdd">该用户名已存在</span>
                </el-form-item>
                <el-form-item label="真实姓名 :" prop="n">
                  <!-- 编辑 -->
                  <el-input style="width: 200px" auto-complete="off" class="noShuRu" v-if="!isAdd" v-model="form.n"></el-input>
                  <!-- 添加 -->
                  <el-input style="width: 200px" auto-complete="off" v-if="isAdd" v-model="form.n"></el-input>
                </el-form-item>
                <el-form-item label="使用状态 : ">
                  <el-radio :label="0" v-model="form.id">启用</el-radio>
                  <el-radio :label="1" v-model="form.id">禁用</el-radio>
                </el-form-item>

                <el-form-item label="重置密码 : " v-show="!isAdd">
                  <el-radio :label="0" v-model="form.w">是</el-radio>
                  <el-radio :label="1" v-model="form.w">否</el-radio>
                </el-form-item>

                <el-form-item label="联系电话 :" prop="p">
                  <el-input style="width: 200px" :maxlength="11" placeholder="请输入手机号码" v-model="form.p"></el-input>
                </el-form-item>

                <el-form-item label="过期时间 :">
                  <el-date-picker
                    :editable="false"
                    placeholder="过期时间"
                    type="date"
                    style="width: 200px"
                    :picker-options="pickerOptions0"
                    v-model="form.expirationTime"
                  ></el-date-picker>
                </el-form-item>

                <el-form-item label="备注 :" label-width="67px">
                  <el-input style="width: 200px" placeholder="请输入用户备注说明" v-model="form.remark"></el-input>
                </el-form-item>
                <div>
                  <span class="historyProblemWrap-title">&nbsp;&nbsp;&nbsp;&nbsp;角色权限设置</span>
                </div>


                <!-- <span class="quanxiantitle">{{form.systemname1}}</span> -->
                  <span class="quanxiantitle" v-if="false">水遥感执法系统 ：</span>
                  <el-form-item class prop="roleId1" v-if="false">
                    <el-select placeholder="请选择权限" v-model="form.roleId1" clearable>
                      <br />
                      <!-- <el-option :disabled="true" :label="roleName" :value="itemId" v-show="roleShow" >{{roleName}}</el-option> -->
                      <el-option
                        :key="item.id"
                        :label="item.rolename"
                        :value="item.id"
                        v-for="item in roleList[1]"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <!-- <span class="quanxiantitle">{{form.systemname2}}</span> -->
                  <span class="quanxiantitle" v-if="false">长江经济带入河排污口排查系统 ：</span>
                  <el-form-item class prop="roleId2" v-if="false">
                    <el-select placeholder="请选择权限" v-model="form.roleId2" clearable>
                      <br />
                      <!-- <el-option :disabled="true" :label="roleName" :value="itemId" v-show="roleShow" >{{roleName}}</el-option> -->
                      <el-option
                        :key="item.id"
                        :label="item.rolename"
                        :value="item.id"
                        v-for="item in roleList[2]"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                <!-- <span class="quanxiantitle">{{form.systemname3}}</span> -->
                  <span class="quanxiantitle" v-if="true">入海排污口排查支持系统 ：</span>
                  <el-form-item class prop="roleId3" v-if="true">
                    <el-select placeholder="请选择权限" v-model="form.roleId3" clearable>
                      <br />
                      <!-- <el-option :disabled="true" :label="roleName" :value="itemId" v-show="roleShow" >{{roleName}}</el-option> -->
                      <el-option
                        :key="item.id"
                        :label="item.rolename"
                        :value="item.id"
                        v-for="item in roleList[3]"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <!-- <span class="quanxiantitle">{{form.systemname4}}</span> -->
                  <span class="quanxiantitle" v-if="false">清废行动系统 ：</span>
                  <el-form-item class prop="roleId4" v-if="false">
                    <el-select placeholder="请选择权限" v-model="form.roleId4" clearable>
                      <br />
                      <!-- <el-option :disabled="true" :label="roleName" :value="itemId" v-show="roleShow" >{{roleName}}</el-option> -->
                      <el-option
                        :key="item.id"
                        :label="item.rolename"
                        :value="item.id"
                        v-for="item in roleList[4]"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                <!-- <span class="quanxiantitle">{{form.systemname5}}</span> -->
                  <span class="quanxiantitle" v-if="false">三磷 ：</span>
                  <el-form-item class prop="roleId5" v-if="false">
                    <el-select v-model="form.roleId5" placeholder="请选择权限" @change="clickChange" clearable>
                      <el-option
                        :key="item.id"
                        :label="item.rolename"
                        :value="item.id"
                        v-for="item in roleList[5]">
                      </el-option>
                    </el-select>
                  </el-form-item>

                <!-- <el-form-item class="yhjs" label="系统管理 : " prop="roleId4">
                  <el-select placeholder="请选择权限" v-model="form.roleId4" clearable>
                    <el-option :disabled="true" :label="roleName" :value="itemId" v-show="roleShow" >{{roleName}}</el-option>
                    <el-option :key="item.id"  :label="item.rolename" :value="item.id" v-for="item in roleList[4]"></el-option>
                  </el-select>
                </el-form-item>-->

                <!-- <el-form-item label="初始密码 :" v-show="isAdd">
                  <input class="shushi" type="hidden">000000
                </el-form-item>-->
                <div style="clear:both"></div>
                <!-- 消除form的浮动没有高度问题 -->
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-layout">
      <span @click="detailsSure" class="sure">确认</span>
      <span @click="reset" class="reset">重 置</span>
      <span @click="detailsCancel" class="cancel">取消</span>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dept: {
      type: Object,
      default: {}
    },
    roleList: {
      type: Array,
      default () {
        return []
      }
    },
    form: {
      type: Object,
      default: {}
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isUsed: {
      type: Boolean,
      default: true
    }
    // roleShow: {
    //   type: Boolean, default: true
    // },
    // roleName: {
    //   type: String, default: ''
    // }
  },
  data () {
    var checkData = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        if (/[\u4e00-\u9fa5]/gm.test(value)) {
          callback(new Error('用户名不能为中文！'))
        } else if (value.indexOf(' ') !== -1) {
          callback(new Error('用户名不能有空格！'))
        } else {
          callback()
        }
      }
    }
    //  {validator: validateNumber, required: false, message: '问题唯一编码必须是数字', trigger: 'change'}
    return {
      userdetail: {},
      loading: false,
      itemId: '',
      rules: {
        un: [{ required: true, trigger: 'blur', validator: checkData }]
        // roleId: [{required: true, message: '请选择角色', trigger: 'change'}]
        /* n: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          p: [{ required: true, message: '请输入手机号', trigger: 'blur' },
            { min: 11, max: 11, message: '请输入11位手机号', trigger: 'change' }
          ] */
      },
      pickerOptions0: {
        disabledDate: time => {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  mounted () {
    this.itemId = this.form.roleId
    if (window.localStorage.getItem('userDetail')) {
      this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
    }
    let h = $('.map-screen-seach')[0].offsetHeight
    $('.el-scrollbar__wrap').css('height', h + 17 + 'px')
    $('.info-layout').css('height', h + 'px')
  },
  watch: {
    'form.roleId' (v, ov) {
      if (v) {
        this.itemId = v
      }
    }
  },
  methods: {
    clickChange (item) {
      console.log(item)
    },
    yanZ () {
      this.$emit('yanZ')
    },
    hideAdd () {
      this.$emit('cancel')
    },
    detailsCancel () {
      this.$emit('cancel')
    },
    reset () {
      this.$emit('reset')
    },
    detailsSure () {
      this.$emit('sure')
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
$fontFamilys: "Microsoft YaHei";
$font: "SimSun";
.quanxiantitle{
  display: block;
  font-size: 12px;
  color: #000000;
  margin-left: 3px;
  margin-bottom: 10px;
}
.historyProblemWrap-title {
  border-left: #1c8ffa 5px solid;
  font-size: 14px;
  font-family: $fontFamilys;
  display: inline-block;
  margin-bottom: 12px;
}
.historyProblemWrap-title-a {
  border-left: #1c8ffa 5px solid;
}
.historyProblemWrap-line {
  border-bottom: #dadbdc 1px solid;
  margin: 5px 0 20px;
}
.map-screen {
  .lsname {
    line-height: 30px;
    height: 30px;
    font-size: 12px;
    color: #606266;
  }
  .basic-form {
    .el-radio {
      padding: 0 10px;
    }
  }
  .basicDetail {
    .detail-form {
      .el-form-item {
        width: 320px !important;
        .el-input__inner {
          width: 220px;
        }
        .el-select {
          width: 220px;
        }
      }
      .yhm .el-form-item__content .el-form-item__error,
      .yhm .el-form-item__content .errorTitle {
        left: 75px !important;
      }
      .yhjs {
        margin-left: -10px !important;
        .el-form-item__content .el-form-item__error {
          left: 85px !important;
        }
      }
    }
  }

  .button-layout {
    position: relative;
    line-height: 40px;
    top: 0;
    height: 60px;
    text-align: center;
    background-color: #fff;
    .sure,
    .reset,
    .cancel {
      display: inline-block;
      font-size: 12px;
      font-family: $font;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .sure,
    .reset {
      width: 66px;
      height: 26px;
      line-height: 26px;
      border-radius: 3px;
    }
    .sure {
      color: #fff;
      border-color: #0099ff;
      background: #0099ff;
      &:hover {
        background: #006bb2;
      }
    }
    .reset {
      margin: 0 0 0 28px;
      color: #323232;
      border-color: #dbdee0;
      background: #f0f0f0;
      &:hover {
        color: #fff;
        background: #006bb2;
      }
    }
    .cancel {
      color: #0099ff;
      margin-left: 20px;
      &:hover {
        border-bottom-color: #0099ff;
      }
    }
  }
}
</style>
