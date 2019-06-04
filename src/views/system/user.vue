<template>
  <div class="user-management">
    <div class="management-left">
      <Panel heightTab="calc(100% - 40px)">
        <div slot="title">
          <i class="icfont iconfont icon-yonghuliebiao"></i>
          用户管理
        </div>
        <div slot="content" style="padding: 20px 0 10px 0px;">
          <div class="ztreeBox">
            <ztree @selectDept="selectDept" v-if="isUpdate"></ztree>
          </div>
        </div>
      </Panel>
    </div>
    <div class="management-right">
      <Panel :warpWidth="warpWidth" v-if="!showNodata" heightTab="calc(100% - 40px)">
        <div slot="title" class="right-title">
          <div style="float:left">
            <div class="handle-button">
              <el-button :type="local ? 'primary' : ''" size="small" round @click="chooseLocal">本单位</el-button>
              <el-button
                :type="local ? '' : 'primary'"
                size="small"
                round
                @click="chooseSubLocal"
              >下属单位</el-button>
            </div>
          </div>
          <el-input
            style="min-width: 230px"
            class="search-input"
            clearable
            size="small"
            placeholder="请输入用户名、电话或真实姓名"
            v-model="searchStr"
            @change="searchSi"
          >
            <i slot="prefix" class="el-input__icon el-icon-search" @click="searchSi"></i>
          </el-input>
          <div style="float:right">
            <div class="handle-button">
              <el-button type="primary" size="small" @click="adding" v-if="local === 1">添加</el-button>
              <el-button type="primary" size="small" @click="delUser">删除</el-button>
              <el-button type="primary" size="small" @click="enableUser">启用</el-button>
              <el-button type="primary" size="small" @click="disableUser">禁用</el-button>
            </div>
          </div>
        </div>
        <div slot="content" class="content">
          <div class="data-jbinfo-table">
            <el-table
              v-loading="loading"
              :data="tableData"
              :height="tableHeight"
              @row-click="rowClick"
              @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="50px"></el-table-column>
              <el-table-column label="使用状态">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.isAvailabled === '0'"
                    style="color: #409EFF;"
                  >启用</el-button>
                  <el-button
                    type="text"
                    v-if="scope.row.isAvailabled === '1'"
                    style="color: #F56C6C;"
                  >禁用</el-button>
                </template>
              </el-table-column>
              <el-table-column label="真实姓名" prop="realName"></el-table-column>
              <el-table-column label="用户名" prop="userName"></el-table-column>
              <!-- <el-table-column label="角色权限" prop="roleName"></el-table-column> -->
              <el-table-column label="单位" prop="jobUnit"></el-table-column>
              <el-table-column label="所属区域" prop="areaName"></el-table-column>
              <el-table-column label="联系电话" prop="phoneNum"></el-table-column>
            </el-table>
          </div>
          <div class="myPage" v-if="total > 0">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="this.limit"
              layout="total, prev, pager, next, jumper"
              :total="total"
              style="text-align: right;margin-right:10px"
            ></el-pagination>
          </div>
        </div>
      </Panel>
      <div class="masker" v-if="showNodata"><span>暂无数据</span></div>
      <transition name="slide-fade">
        <basic-user-info
          :dept="dept"
          :form="form"
          :isAdd="isAdd"
          :isUsed="isUsed"
          :roleList="roleList"
          @cancel="detailsCancel"
          @reset="detailsReset"
          @sure="detailsSure"
          @yanZ="yanZ"
          ref="basicUser"
          v-if="showDetail"
        ></basic-user-info>
      </transition>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
import moment from 'moment'
import * as api from '@/store/api'
import Panel from '@/components/Panel'
import ztree from './components/tree'
import BasicUserInfo from './components/basic-user-info'
export default {
  data () {
    return {
      systemItem: {},
      loading: false,
      showNodata: false,
      warpWidth: '100%',
      tableData: [],
      currentPage: 1,
      tableHeight: 100,
      limit: 10,
      total: 10,
      jobUnitCode: '',
      local: 1,
      searchStr: '',
      multipleSelection: [],
      showDetail: false,
      dept: {},
      form: {
        ia: '', //  是否为管理员 0是 1否
        c: '', // 用户编码
        i: '', // 用户id
        ju: '', // 工作单位
        un: '', // 用户名
        w: 1, // 密码
        n: '', // 真实姓名
        id: 0, // 是否禁用 0启用 1禁用
        roleId: '', // 权限
        roleId0: '', // 权限
        roleId1: '', // 权限
        roleId2: '', // 权限
        roleId3: '', // 权限
        roleId4: '', // 权限
        roleId5: '', // 权限
        p: '', // 联系电话
        uc: '', // 单位编码
        expirationTime: '', //  过期时间
        remark: '', //  备注
        systemQxList: []
      },
      isAdd: true,
      isUsed: false,
      role: [],
      roleList: [],
      roleId: '',
      isUpdate: true,
      userDetail: {},
      system1: [],
      system2: [],
      system3: [],
      system4: [],
      system5: [],
      userById: []
    }
  },
  mounted () {
    if (window.localStorage.getItem('systemItem')) {
      this.systemItem = JSON.parse(window.localStorage.getItem('systemItem'))
      // 添加用户权限下拉框接口
      this.getTypeByUser(this.systemItem.type)
    }
    if (window.localStorage.getItem('userDetail')) {
      this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
    }
    // 计算表格的高度，确定每页显示的条数
    this.tableHeight = $('.data-jbinfo-table').height()
    this.limit = Math.floor((this.tableHeight - 42) / 42)
  },
  methods: {
    getTypeByUser (type) {
      api.getTypeByUser(type).then(res => {
        this.system1 = res.data.r.system1
        this.system2 = res.data.r.system2
        this.system3 = res.data.r.system3
        this.system4 = res.data.r.system4
        this.system5 = res.data.r.system5

        this.roleList[1] = res.data.r.system1
        this.roleList[2] = res.data.r.system2
        this.roleList[3] = res.data.r.system3
        this.roleList[4] = res.data.r.system4
        this.roleList[5] = res.data.r.system5
      }).catch(e => {})
    },
    createDate (item) {
      let obj = {}
      obj.systemtype = item.systemtype
      obj.rolename = item.rolename
      obj.id = item.id
      return obj
    },
    getRoleListByUserId (id) {
      api.getRoleListByUserId(id).then(res => {
        if (res.data.r) {
          this.userById = res.data.r.date
          this.userById.forEach(item => {
            if (item.systemtype === 1) {
              if (this.system1.length === 0) {
                this.roleList[1] = []
                this.form.roleId1 = ''
              } else {
                if (this.system1 instanceof Array) {
                  let flag = this.system1.some(el => el.id === item.id)
                  if (!flag) {
                    this.system1.unshift(this.createDate(item))
                  }
                }
                this.roleList[1] = this.system1
                this.form.roleId1 = item.id
              }
            }
            if (item.systemtype === 2) {
              if (this.system2.length === 0) {
                this.roleList[2] = []
                this.form.roleId2 = ''
              } else {
                if (this.system2 instanceof Array) {
                  let flag = this.system2.some(el => el.id === item.id)
                  if (!flag) {
                    this.system2.unshift(this.createDate(item))
                  }
                }
                this.roleList[2] = this.system2
                this.form.roleId2 = item.id
              }
            }
            if (item.systemtype === 3) {
              if (this.system3.length === 0) {
                this.roleList[3] = []
                this.form.roleId3 = ''
              } else {
                if (this.system3 instanceof Array) {
                  let flag = this.system3.some(el => el.id === item.id)
                  if (!flag) {
                    this.system3.unshift(this.createDate(item))
                  }
                }
                this.roleList[3] = this.system3
                this.form.roleId3 = item.id
              }
            }
            if (item.systemtype === 4) {
              if (this.system4.length === 0) {
                this.roleList[4] = []
                this.form.roleId4 = ''
              } else {
                if (this.system4 instanceof Array) {
                  let flag = this.system4.some(el => el.id === item.id)
                  if (!flag) {
                    this.system4.unshift(this.createDate(item))
                  }
                }
                this.roleList[4] = this.system4
                this.form.roleId4 = item.id
              }
            }
            if (item.systemtype === 5) {
              if (this.system5.length === 0) {
                this.roleList[5] = []
                this.form.roleId5 = ''
              } else {
                if (this.system5 instanceof Array) {
                  let flag = this.system5.some(el => el.id === item.id)
                  if (!flag) {
                    this.system5.unshift(this.createDate(item))
                  }
                }
                this.roleList[5] = this.system5
                this.form.roleId5 = item.id
              }
            }
          })
        }
      })
    },
    detailsCancel () {
      this.showDetail = false
      this.resetData()
    },
    detailsReset () {
      if (this.flag === 'add') {
        this.resetData()
      } else if (this.flag === 'edit') {
        this.form = {
          ia: '', // 是否为管理员 0是 1否
          c: '', // 用户编码
          un: this.form.un, // 用户名
          i: this.form.i, // 用户id
          ju: this.form.ju, // 工作单位
          w: 1, // 密码
          n: '', // 真实姓名
          id: 0, // 用户使用状态
          roleId: '', // 权限
          roleId0: '', // 权限
          roleId1: '', // 权限
          roleId2: '', // 权限
          roleId3: '', // 权限
          roleId4: '', // 权限
          p: '', // 联系电话
          uc: '', // 单位编码
          expirationTime: '',
          remark: '', // 备注
          systemQxList: []
        }
      }
    },
    // 权限控制
    getSystemQxList (form) {
      if (form.roleId1) {
        form.systemQxList.push({
          id: '',
          roleid: form.roleId1,
          systemtype: 1,
          userid: ''
        })
      }
      if (form.roleId2) {
        form.systemQxList.push({
          id: '',
          roleid: form.roleId2,
          systemtype: 2,
          userid: ''
        })
      }
      if (form.roleId3) {
        form.systemQxList.push({
          id: '',
          roleid: form.roleId3,
          systemtype: 3,
          userid: ''
        })
      }
      if (form.roleId4) {
        form.systemQxList.push({
          id: '',
          roleid: form.roleId4,
          systemtype: 4,
          userid: ''
        })
      }
      if (form.roleId5) {
        form.systemQxList.push({
          id: '',
          roleid: form.roleId5,
          systemtype: 5,
          userid: ''
        })
      }
      return form
    },
    detailsSure () {
      this.form.systemQxList = []
      this.getSystemQxList(this.form)
      if (this.isAdd) {
        this.form.w = md5('000000')
      } else {
        if (this.form.w === 0 || this.form.w === '') {
          this.form.w = md5('000000')
        } else {
          this.form.w = ''
        }
      }
      let l = this
      let form2 = JSON.parse(JSON.stringify(l.form))
      if (form2.expirationTime) {
        form2.expirationTime = moment(form2.expirationTime).format(
        'YYYY-MM-DD'
        )
      } else {
        form2.expirationTime = ''
      }
      this.$refs.basicUser.$refs.form.validate(result => {
        if (result) {
          if (l.dept.c && l.dept.n) {
            form2.uc = l.dept.c
            form2.ju = l.dept.n
          }
          if (form2.ju === 'undefined') {
            l.$message({
              message: '',
              type: 'error'
            })
          } else {
            // 标记
            if (this.local === 0) {
              form2.uc = this.form.uc
              form2.ju = this.form.ju
            }
            api.saveUser(form2).then(res => {
              console.log(res)
              if (res.status === 200 && res.data.c === 1 && res.data.m === '请求成功') {
                l.getUserList(1)
                l.showDetail = false
                if (l.flag === 'edit') {
                  l.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                } else {
                  l.$message({
                    message: '添加成功',
                    type: 'success'
                  })
                }
              } else if (res.status === 200 && res.data.c === 0 && res.data.m === '用户名已存在') {
                l.isUsed = true
              } else if (res.status === 200 && res.data.c === 0) {
                l.$message({message: res.data.m, type: 'error'})
              }
            }).catch(e => {
              console.log(e)
              l.$message({message: '操作失败', type: 'error'})
            })
          }
        }
      })
    },
    yanZ () {
      this.isUsed = false
    },
    resetData () {
      this.form = {
        ia: '', //  是否为管理员 0是 1否
        c: '', // 用户编码
        i: '', // 用户id
        ju: '', // 工作单位
        un: '', // 用户名
        w: 1, // 密码
        n: '', // 真实姓名
        id: 0, // 是否禁用 0启用 1禁用
        roleId: '', // 权限
        roleId0: '', // 权限
        roleId1: '', // 权限
        roleId2: '', // 权限
        roleId3: '', // 权限
        roleId4: '', // 权限
        p: '', // 联系电话
        uc: '', // 单位编码
        expirationTime: '', //  过期时间
        remark: '', //  备注
        systemQxList: []
      }
    },
    handleCurrentChange (_current) {
      this.getUserList(_current)
    },
    getUserList (num) {
      this.loading = true
      let params = {
        limit: this.limit,
        current: num,
        jobUnitCode: this.jobUnitCode,
        local: this.local,
        roleid: '',
        si: this.searchStr
      }
      api.getUserList(params).then(res => {
        if (res.status === 200 && res.data.c === 1) {
          var arr = res.data.r.data
          this.tableData = arr
          this.total = res.data.r.total
          this.loading = false
        } else {
          this.loading = false
          this.$message({ message: '查询失败，请稍后再试', type: 'error' })
        }
      }).catch(e => {
        this.loading = false
        this.$message({ message: '查询失败，请稍后再试', type: 'error' })
      })
    },
    selectDept (dept) {
      if (dept.nodata) {
        this.tableData = []
        this.showNodata = true
        return
      }
      this.showNodata = false
      this.local = 1
      this.dept = dept
      this.jobUnitCode = dept.c
      this.$nextTick(_ => {
        this.currentPage = 1
      })
      this.getUserList(1)
      this.loading = false
    },
    rowClick (row, event, column) {
      if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'SPAN') {
        return
      }
      // 当前用户权限下拉框接口
      this.getRoleListByUserId(row.id)
      this.flag = 'edit'
      this.form.i = row.id
      this.form.id = parseInt(row.isAvailabled)
      this.form.ju = row.jobUnit
      this.form.uc = row.jobUnitCode
      this.form.w = 1
      this.form.p = row.phoneNum
      this.form.n = row.realName
      this.form.un = row.userName
      this.form.expirationTime = row.expirationtime
      this.form.roleId = row.roleId
      this.form.remark = row.remark
      this.isAdd = false
      this.showDetail = true
    },
    handleSelectionChange (val) {
      this.showDetail = false
      this.multipleSelection = val
    },
    delUser () {
      let arr = []
      if (this.multipleSelection.length && this.multipleSelection.length > 0) {
        arr = this.multipleSelection.map(item => item.id)
        let params = {
          i: arr.join()
        }
        api.deleteUser(params).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            this.getUserList(1)
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败，请稍后再试'
            })
          }
        }).catch(e => {
          this.$message({
            type: 'warning',
            message: '删除失败，请稍后再试'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '没有选中'
        })
      }
    },
    enableUser () {
      let arr = []
      if (this.multipleSelection.length && this.multipleSelection.length > 0) {
        arr = this.multipleSelection.map(item => item.id)
        let params = arr.join()
        api.enable(params).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$message({
              type: 'success',
              message: '启用成功！'
            })
            this.getUserList(1)
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '没有选中'
        })
      }
    },
    disableUser () {
      let arr = []
      if (this.multipleSelection.length && this.multipleSelection.length > 0) {
        arr = this.multipleSelection.map(item => item.id)
        let params = arr.join()
        api.disable(params).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$message({
              type: 'success',
              message: '禁用成功！'
            })
            this.getUserList(1)
          }
        })
      } else {
        this.$message({
          type: 'warning',
          message: '没有选中'
        })
      }
    },
    adding () {
      this.showDetail = true
      this.isAdd = true
      this.flag = 'add'
      this.resetData()
    },
    chooseLocal () {
      this.local = 1
      this.getUserList(1)
    },
    chooseSubLocal () {
      this.local = 0
      this.getUserList(1)
    },
    // 搜索
    searchSi () {
      this.getUserList(1)
    }
  },
  components: {
    BasicUserInfo,
    Panel,
    ztree
  }
}
</script>

<style lang="scss" type="text/scss">
  .management-right {
    .el-scrollbar__view {
      position: relative;
      height: 100%;
    }
  }
</style>

<style lang="scss" type="text/scss" scoped>
.user-management {
  display: flex;
  width: 100%;
  height: 100%;
  background: #f2f6fc;
  .management-left {
    position: relative;
    background: #fff;
    width: 320px;
    height: 100%;
    .ztree-wrap {
      height: calc(100% - 0px);
      margin: 18px 0;
      .el-scrollbar__wrap {
        overflow-y: auto !important;
        height: 100%;
        .el-scrollbar__view {
          height: 100%;
          .ztreeBox {
            position: relative;
            height: 100%;
          }
        }
      }
    }
  }
  .management-right {
    position: relative;
    background: #fff;
    width: calc(100% - 340px);
    height: calc(100% - 40px);
    margin: 20px;
    .masker{
      width: 100%;
      height: 100%;
      position: relative;
      span{
        color: #999;
        position: absolute;
        width: 200px;
        height: 50px;
        line-height: 50px;
        left: 50%;
        top: 50%;
      }
    }
    .right-title {
      width: 100%;
      height: 100%;
    }
    .el-scrollbar__view {
      .content {
        padding: 20px;
        height: calc(100% - 20px);
        .data-jbinfo-table {
          position: relative;
          width: calc(100%);
          height: calc(100% - 40px);
          overflow: hidden;
          .el-table th {
            background: #e4ebf3;
          }
        }
        .myPage {
          margin-top: 20px;
        }
      }
    }
    .search-input {
      float: left;
      width: 25%;
      margin-left: 20px;
    }
  }
}
</style>
