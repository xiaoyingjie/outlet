<template>
  <div class="organization">
    <Panel>
      <div slot="title">
        <i class="icfont iconfont icon-yonghuliebiao"></i>
        组织机构管理
      </div>
      <div slot="content" style="padding: 20px 0 10px 0px;">
        <div class="ztreeBox">
          <ztree @selectDept="selectDept" v-if="isUpdate"></ztree>
        </div>
      </div>
    </Panel>
    <div class="right-content-wrap">
      <div class="handle-button">
        <el-button type="primary" @click="addSubUnit" :disabled="disabledFalg || dept.n === '生态环境部'">添加下级单位</el-button>
      </div>
      <el-form :model="departmentForm" label-position="left" ref="departmentForm" label-width="120px" :rules="rules" class="demo-ruleForm">
        <el-form-item prop="unitName" label="部门名称">
          <el-input v-model="departmentForm.unitName"></el-input>
        </el-form-item>
        <el-form-item prop="selectXzqh" label="行政区划">
          <el-cascader
            :options="options"
            change-on-select
            :clearable="true"
            :props="xzqhprops"
            v-model="departmentForm.selectXzqh"
            :show-all-levels="false"
            filterable
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="departmentForm.address"></el-input>
        </el-form-item>
        <el-form-item prop="telephone" label="电话">
          <el-input v-model="departmentForm.telephone"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="departmentForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="描述">
          <el-input v-model="departmentForm.remark" type="textarea" class="textarea"></el-input>
        </el-form-item>
        <el-form-item class="submit-button">
          <el-button type="primary" @click="submitForm('departmentForm')">{{save}}</el-button>
          <el-button @click="resetForm()">取消</el-button>
        </el-form-item>
        <div style="clear:both"></div> <!-- 消除form的浮动没有高度问题 -->
      </el-form>
    </div>
  </div>
</template>

<script>
import * as api from '../../store/api'
import Panel from '../../components/Panel'
import ztree from '../../components/tree.vue'
export default {
  components: {
    Panel,
    ztree
  },
  data () {
    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入部门名称'))
      } else if (this.addSubFlag) {
        api.getUnitName(value).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            callback(new Error('该名字已存在'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    var checkData = (rule, value, callback) => {
      if (this.departmentForm.unitCode === '0' || this.departmentForm.unitCode.length === 3) {
        callback()
      } else {
        if (value.length === 0) {
          callback(new Error('请选择行政区划'))
        } else {
          callback()
        }
      }
    }
    return {
      save: '保存',
      parentData: {
        unitCode: '',
        unitType: ''
      },
      addSubFlag: false,
      disabledFalg: true,
      dept: {},
      isUpdate: true,
      loading: false,
      departmentForm: {
        unitName: '',
        corporateServicesDivisions: [],
        xzqh: [],
        address: '',
        telephone: '',
        email: '',
        remark: '',
        selectXzqh: [],
        unitCode: '0'
      },
      options: [],
      rules: {
        unitName: [{required: true, validator: checkName, trigger: 'blur'}],
        selectXzqh: [{required: true, trigger: 'change', validator: checkData}]
      },
      xzqhprops: {
        value: 'c',
        label: 'n',
        children: 'nodes'
      },
      city: '',
      userdetail: {}
    }
  },
  created () {
    if (window.localStorage.getItem('userDetail')) {
      this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
    }
    this.getXzqh(this.userdetail.userId)
  },
  methods: {
    selectDept (dept) {
      this.save = '保存'
      this.dept = dept
      this.loading = false
      if (dept.id) {
        this.addSubFlag = false
        this.disabledFalg = false
      } else {
        this.addSubFlag = true
        this.disabledFalg = true
      }
    },
    handleChange (v) {
      if (v.length !== 0) {
        let xzqh = v.toString()
        let cityCode = xzqh.substr(xzqh.lastIndexOf(',') + 1, xzqh.length)
        this.city = cityCode
      } else {
        this.city = ''
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.addSubFlag) {
            let subForm = {}
            subForm.id = this.departmentForm.id
            subForm.isUpdate = this.departmentForm.isUpdate
            subForm.parentCode = this.departmentForm.parentCode
            subForm.remark = this.departmentForm.remark
            subForm.state = this.departmentForm.state
            subForm.telephone = this.departmentForm.telephone
            subForm.unitCode = this.departmentForm.unitCode
            subForm.unitName = this.departmentForm.unitName
            subForm.unitType = this.departmentForm.unitType
            subForm.xzqh = this.city === '' ? '' : this.city
            if (this.departmentForm.unitCode === '0' || this.departmentForm.unitCode.length === 3) {
              subForm.xzqh = ''
            }
            subForm.address = this.departmentForm.address
            subForm.email = this.departmentForm.email
            api.updateUnit(subForm).then(res => {
              if (res.status === 200 && res.data.c === 1) {
                this.reload()
                this.$message({message: '更新成功', type: 'success'})
              } else {
                this.$message({message: '失败，请稍后再试', type: 'error'})
              }
            }).catch(e => {
              this.$message({message: '失败，请稍后再试', type: 'error'})
            })
          } else {
            let subForm = {}
            subForm.id = ''
            subForm.iu = 0
            subForm.pc = this.parentData.unitCode
            subForm.re = this.departmentForm.remark
            subForm.st = 0
            subForm.te = this.departmentForm.telephone
            subForm.uc = ''
            subForm.n = this.departmentForm.unitName
            subForm.ty = this.parentData.unitType
            subForm.xz = this.city === '' ? '' : this.city
            subForm.ad = this.departmentForm.address
            subForm.em = this.departmentForm.email
            api.addChild(subForm).then(res => {
              if (res.status === 200 && res.data.c === 1) {
                this.reload()
                this.$message({message: '添加成功', type: 'success'})
              } else {
                this.$message({message: '失败，请稍后再试', type: 'error'})
              }
            }).catch(e => {
              this.$message({message: '失败，请稍后再试', type: 'error'})
            })
          }
        } else {
          return false
        }
      })
    },
    resetForm () {
      if (this.departmentForm && this.departmentForm.id) {
        api.getUnitInfoByUnitId(this.departmentForm).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.departmentForm = res.data.r.data
            this.departmentForm.selectXzqh = []
            if (res.data.r.data.xzqh) {
              let xzqh = res.data.r.data.xzqh
              let fr = xzqh.slice(0, 2)
              let city = xzqh.slice(0, 4)
              if (xzqh.slice(2, 6) === '0000') {
                this.departmentForm.selectXzqh.push(xzqh)
              } else if (xzqh.slice(4, 6) === '00') {
                let proXzqh = fr + '0000'
                this.departmentForm.selectXzqh.push(proXzqh)
                this.departmentForm.selectXzqh.push(xzqh)
              } else {
                let proXzqh = fr + '0000'
                let cityXzqh = city + '00'
                this.departmentForm.selectXzqh.push(proXzqh)
                this.departmentForm.selectXzqh.push(cityXzqh)
                this.departmentForm.selectXzqh.push(xzqh)
              }
            }
          } else {
            // this.$message({message: '失败，请稍后再试', type: 'error'})
          }
        }).catch(e => {
          // this.$message({message: '失败，请稍后再试', type: 'error'})
        })
      }
    },
    addSubUnit () {
      this.departmentForm = {
        unitName: '',
        corporateServicesDivisions: [],
        xzqh: [],
        address: '',
        telephone: '',
        email: '',
        remark: '',
        selectXzqh: [],
        unitCode: '0'
      }
      this.addSubFlag = true
      this.save = '新增'
    },
    reload () {
      this.isUpdate = false
      this.$nextTick(() => (this.isUpdate = true))
    },
    getXzqh (userId) {
      let options = JSON.parse(window.sessionStorage.getItem('ctOptions'))
      if (options) {
        this.options = options
      } else {
        api.getXzqh(userId).then(res => {
          if (res.status === 200 && res.data.c === 1 && res.data.r) {
            this.options = res.data.r.xzqh
            if (this.options.length !== 0) {
              window.sessionStorage.setItem('ctOptions', JSON.stringify(res.data.r.xzqh))
            }
          }
        })
      }
    },
    getSubXzqh (options, xzqh) {
      let fr = xzqh.slice(0, 2)
      let city = xzqh.slice(0, 4)
      let proXzqh = fr + '0000'
      let cityXzqh = city + '00'
      // 选择省行政区划
      if (xzqh.slice(2, 6) === '0000') {
        this.options = options.filter(item => item.c === xzqh)
        // 选择市行政区划
      } else if (xzqh.slice(4, 6) === '00') {
        if (this.options.length === 1) {
          let xzqh1 = this.options[0].c
          if (xzqh1.slice(2, 6) === '0000') {
            this.options = options.filter(item => item.c === proXzqh)
            this.options = this.options[0].nodes.filter(item => item.c === xzqh)
          } else if (xzqh1.slice(4, 6) === '00') {
            this.options = options.filter(item => item.c === xzqh)
          }
        } else {
          this.options = options.filter(item => item.c === proXzqh)
          this.options = this.options[0].nodes.filter(item => item.c === xzqh)
        }
      } else {
        // 选择区县行政区划
        if (this.options.length === 1) {
          let xzqh2 = this.options[0].c
          if (xzqh2.slice(2, 6) === '0000') {
            this.options = options.filter(item => item.c === proXzqh)
            this.options = this.options[0].nodes
            this.options = this.options.filter(item => item.c === cityXzqh)
            this.options = this.options[0].nodes.filter(item => item.c === xzqh)
          } else if (xzqh2.slice(4, 6) === '00') {
            this.options = this.options.filter(item => item.c === cityXzqh)
            this.options = this.options[0].nodes.filter(item => item.c === xzqh)
          }
        } else {
          this.options = options.filter(item => item.c === proXzqh)
          this.options = this.options[0].nodes
          this.options = this.options.filter(item => item.c === cityXzqh)
          this.options = this.options[0].nodes.filter(item => item.c === xzqh)
        }
      }
    }
  },
  watch: {
    dept: {
      handler (curVal, oldVal) {
        // 发起http请求，获取部门详情
        if (curVal.id) {
          api.getUnitInfoByUnitId(curVal).then(res => {
            if (res.status === 200 && res.data.c === 1) {
              this.departmentForm = res.data.r.data
              this.getXzqh(this.userdetail.userId)
              // 获取下级xzqh
              if (this.departmentForm && this.departmentForm.xzqh) {
                this.city = this.departmentForm.xzqh
                this.getSubXzqh(this.options, this.departmentForm.xzqh)
              }
              this.departmentForm.selectXzqh = []
              if (res.data.r.data.xzqh) {
                let xzqh = res.data.r.data.xzqh
                let fr = xzqh.slice(0, 2)
                let city = xzqh.slice(0, 4)
                if (xzqh.slice(2, 6) === '0000') {
                  this.departmentForm.selectXzqh.push(xzqh)
                } else if (xzqh.slice(4, 6) === '00') {
                  let proXzqh = fr + '0000'
                  this.departmentForm.selectXzqh.push(proXzqh)
                  this.departmentForm.selectXzqh.push(xzqh)
                } else {
                  let proXzqh = fr + '0000'
                  let cityXzqh = city + '00'
                  this.departmentForm.selectXzqh.push(proXzqh)
                  this.departmentForm.selectXzqh.push(cityXzqh)
                  this.departmentForm.selectXzqh.push(xzqh)
                }
              }
              if (res.data.r.data.unitType === 4 || curVal.c === '00') {
                this.disabledFalg = true
              } else {
                this.disabledFalg = false
              }
              this.parentData = {
                unitCode: res.data.r.data.unitCode,
                unitType: res.data.r.data.unitType
              }
            } else {
              this.$message({message: '失败，请稍后再试', type: 'error'})
            }
          }).catch(e => {
            // this.$message({message: '失败，请稍后再试', type: 'error'})
          })
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
  .organization {
    height: 100%;
    .right-content-wrap {
      padding: 20px 150px 20px 420px;
      height: 100%;
      .handle-button {
        text-align: right;
        margin-bottom: 40px;
      }
      .demo-ruleForm {
        .el-cascader{
          width: 100%;
        }
        .submit-button {
          text-align: center;
        }
      }
    }
  }
  // .ztree-wrap {
  //   height: calc(100% - 85px);
  //   margin: 18px 0;
  //   .el-scrollbar__wrap {
  //     overflow-y: auto !important;
  //     height: 100%;
  //     .el-scrollbar__view {
  //       height: 100%;
  //       .ztreeBox {
  //         position: relative;
  //         height: 100%;
  //       }
  //     }
  //   }
  // }

  .ztree-wrap {
      height: calc(100% - 0px);
      margin: 18px 0;
      .el-scrollbar__wrap {
        overflow-y: auto !important;
        height: 100%;
        .el-scrollbar {
          overflow: visible;
        }
        .el-scrollbar__view {
          height: 100%;
          .ztreeBox {
            position: relative;
            height: calc(100% + 20px);
          }
        }
      }
    }
</style>
