<template>
	<div class="role-management">
		<div class="role-management-left">
			<Panel style="height: calc(100% - 80px);" heightTab="calc(100% - 40px)">
	      <div slot="title">
	        <i class="icfont iconfont icon-jiben"></i>
	        <span>{{roleMsg}}</span></div>
	      <div slot="content">
	      	<div v-for="(item,j) in roleList" :key="item.id">
	      		<div class="role-user" :class="{'active':nav == j}" @click="detailClick(j, item.id)">{{item.rolename}}</div>
	      	</div>
	      </div>
	    </Panel>
      <div class="addwrap">
        <div class="add" @click="addRole"><i class="el-icon-plus"></i></div>
      </div>
		</div>
		<div class="role-management-right">
			<div class="role-title">
				<div class="fl">
					<span class="role-tit-des">
            <span class="iconfont icon-jiben nav-icon"></span>
					  <span class="nav-tit col">角色信息管理</span>
					</span>
				</div>
				<div class="fr">
					<span class="role-tit-des" @click="save">
            <span class="iconfont icon-yonghutianjia nav-icon"></span>
					<span class="nav-tit">保存</span>
					</span>
					<span class="role-tit-des" @click="cancle">
            <span class="iconfont icon-yonghutianjia nav-icon"></span>
					<span class="nav-tit">取消</span>
					</span>
				</div>
			</div>
			<div class="role-info">
				<div class="role-form">
					<el-form class="demo-roleForm" style="min-width: 618px" :rules="rules" :model="form" ref="form">
						<el-form-item label="角色名称 : " prop="roleName">
							<el-input v-model="form.roleName" placeholder="角色名称" clearable></el-input>
						</el-form-item>
						<el-form-item label="角色等级 : " prop="typename">
							<el-select v-model="form.typename" clearable placeholder="角色等级" @change=changeF>
								<el-option label="系统级" value="0"></el-option>
								<el-option label="部级" value="1"></el-option>
								<el-option label="地方级" value="2"></el-option>
								<el-option label="督察级" value="3"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="角色描述 : ">
							<el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="form.roleDesc" class="report-mark" placeholder="请输入角色描述" resize="none" type="textarea">
							</el-input>
						</el-form-item>
					</el-form>
				</div>
        <el-scrollbar :noresize="false" :native="false">
          <table-checkbox :items="items"></table-checkbox>
        </el-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
import Panel from '@/components/Panel'
import * as api from '@/store/api'
import TableCheckbox from './components/TableCheckbox.vue'
export default {
  data () {
    return {
      addState: true,
      originData: {},
      userdetail: {},
      roleMsg: '角色管理',
      roleList: [],
      searchId: '',
      form: {},
      checkAll: false,
      checkedCities: {},
      cities: ['上海', '北京', '广州', '深圳'],
      isIndeterminate: true,
      nav: 999,
      items: [],
      rules: {
        roleName: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
        typename: [{required: true, message: '请输入角色等级', trigger: 'change'}]
      }
    }
  },
  mounted () {
    if (window.localStorage.getItem('userDetail')) {
      this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
    }
    let roleidItem = JSON.parse(window.localStorage.getItem('userDetail')).systemQxList.filter(item => item.systemtype === 3)
    this.searchId = roleidItem[0].roleid
    this.getRoleList(this.searchId)
    this.getMoudleTree()
  },
  watch: {
    'form.type' (v, ov) {
      if (v) {
        this.form.type = v.toString()
      }
    }
  },
  methods: {
    changeF (value) {
      this.form.value = value
    },
    //  获取角色列表
    getRoleList (id) {
      api.getRoleList(id).then(res => {
        if (res.status === 200) {
          this.roleList = res.data.r.date
        }
      }).catch(() => {
        this.$message({message: '查询异常', type: 'warning', duration: 1000, customClass: 'axios_error'})
      })
    },
    //  获取全部权限
    getMoudleTree (param) {
      api.getMoudleTree(param).then(res => {
        if (res.status === 200) {
          this.items = res.data.r.data[0].items
          let arr = {}
          for (let i of this.items) {
            if (i.items && i.items.length > 0) {
              for (let j of i.items) {
                arr['app' + j.id] = []
              }
            } else {
              arr['app' + i.id] = []
            }
          }
          this.checkedCities = {...arr}
        }
      }).catch(() => {
        this.$message({message: '查询异常', type: 'warning', duration: 1000, customClass: 'axios_error'})
      })
    },
    //  新增保存
    save () {
      this.$refs.form.validate(result => {
        if (result) {
          let oid = JSON.parse(localStorage.getItem('userDetail')).userId
          // /*  这里组织基本数据，上面角色名称什么的*/
          let params = {
            careaterId: oid,
            createtime: '',
            id: '',
            roleDesc: this.form.roleDesc,
            roleName: this.form.roleName,
            type: +this.form.value,
            typename: this.form.typename,
            items: []
          }
          let itemsArr = []
          this.items.map(item => {
            //  这里是判断是否有二级
            if (item.items && item.items.length > 0) {
              let arr2 = []
              if (item.check) {
                arr2.push({
                  createrid: oid,
                  moudleid: item.moudleid,
                  operationid: item.operationid,
                  roleid: ''
                })
              }
              item.items.map(subItem => {
                let arr = []
                if (subItem.check) {
                  arr.push({
                    createrid: oid,
                    moudleid: subItem.moudleid,
                    operationid: subItem.operationid,
                    roleid: ''
                  })
                }
                subItem.oitems.map(subsubitem => {
                  if (subsubitem.check) {
                    arr.push({
                      createrid: oid,
                      moudleid: subItem.moudleid,
                      operationid: subsubitem.operationid,
                      roleid: ''
                    })
                  }
                })
                //  判断是否有打钩
                if (arr.length > 0) {
                  itemsArr.push({
                    createrid: oid,
                    moudleid: subItem.moudleid,
                    oitems: arr,
                    roleid: ''
                  })
                }
              })
              //  判断是否有打钩
              if (arr2.length > 0) {
                itemsArr.push({
                  createrid: oid,
                  moudleid: item.moudleid,
                  oitems: arr2,
                  roleid: ''
                })
              }
            } else {
              let arr = []
              if (item.check) {
                arr.push({
                  createrid: oid,
                  moudleid: item.moudleid,
                  operationid: item.operationid,
                  roleid: ''
                })
              }
              item.oitems.map(subItem => {
                if (subItem.check) {
                  arr.push({
                    createrid: oid,
                    moudleid: item.moudleid,
                    operationid: subItem.operationid,
                    roleid: ''
                  })
                }
              })
              //  判断是否有打钩
              if (arr.length > 0) {
                itemsArr.push({
                  createrid: oid,
                  moudleid: item.moudleid,
                  oitems: arr,
                  roleid: ''
                })
              }
            }
          })
          if (!this.addState) {
            params.id = this.form.id
            itemsArr.map(item => {
              item.roleid = this.searchId
              item.oitems.map(subItem => {
                subItem.roleid = this.searchId
              })
            })
          }
          params.items = itemsArr
          api.addRole(params).then(res => {
            if (res.data.m === '请求成功') {
              this.getRoleList(this.searchId)
              this.form = {}
              this.nav = 999
              this.getMoudleTree()
              this.$message({message: '更新成功', type: 'success'})
            } else {
              this.$message({message: '添加失败，请稍后再试', type: 'error'})
            }
          })
        }
      })
    },
    addRole () {
      this.addState = true
      this.save()
      this.form = {}
      this.nav = 999
      this.getMoudleTree()
    },
    cancle () {
      if (!this.addState) {
        this.detailClick(this.originData.i, this.originData.id)
      }
    },
    //  获取角色详情
    detailClick (i, id) {
      this.originData.i = i
      this.originData.id = id
      this.addState = false
      this.nav = i
      api.getRoleDetailById(id).then(res => {
        this.form = res.data.r.data
        this.form.value = res.data.r.data.type
      })
      api.getMoudleTree(id).then(res => {
        if (res.status === 200) {
          this.items = res.data.r.data[0].items
          this.checkedCities = {}
          let odata = {}
          for (let i of res.data.r.data[0].items) {
            if (i.items && i.items.length > 0) {
              for (let j of i.items) {
                let oid = 'app' + j.id
                odata[oid] = []
                for (let k of j.oitems) {
                  if (k.check) {
                    odata[oid].push(k.operationid)
                  }
                }
              }
            } else {
              let oid = 'app' + i.id
              odata[oid] = []
              for (let j of i.oitems) {
                if (j.check) {
                  odata[oid].push(j.operationid)
                }
              }
            }
          }
          this.checkedCities = odata
        }
      })
    }
  },
  components: {
    Panel,
    TableCheckbox
  }
}
</script>

<style lang="scss" type="text/scss">
    .role-management {
      display: flex;
      height: 100%;
      width: 100%;
      background-color: #ffffff;
      .role-management-left{
        position: relative;
        background: #fff;
        // padding-bottom: 90px;
        width: 320px;
        height: 100%;
        .role-user {
          box-sizing: border-box;
          width:100%;
          height:32px;
          line-height:32px;
          text-align:left;
          font-size:14px;
          cursor:pointer;
          color:#323232;
          padding-left:14px;
          border-bottom: 1px solid #ddd;
        }
        .role-user:hover,.role .active{
          background:#f0f5fa;
          color:#1a82ee
        }
        .addwrap{
          position: absolute;
          background: white;
          bottom: 0;
          width: 100%;
          height: 80px;
          .add {
            position: absolute;
            left: 32px;
            top: 20px;
            cursor: pointer;
            width: 243px;
            height: 26px;
            border: 1px dashed #d0d2d4;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            z-index: 10000;
            font-weight: bold;
            // margin: 20px 0 50px 14px;
            border-radius: 4px;
            i {
              color: #d0d2d4;
              width: 14px;
              height: 14px;
              line-height: 14px;
            }
          }
        }
      }
      .role-management-right {
        position: relative;
        background: #fff;
        width: calc(100% - 340px);
        height: calc(100% - 40px);
        margin: 20px;
        .role-title {
          height: 42px;
          line-height: 42px;
          border-bottom: 1px solid #ebebeb;
          padding: 0 4px 0 14px;
          font-size: 14px;
          color: #000000;
          .fl {
            float: left;
          }
          .fr {
            float: right;
            cursor: pointer;
          }
          .role-tit-des {
            margin-right: 16px;
            .col {
              color: #1a82ee;
            }
            .nav-icon {
              margin-right: 2px;
              font-size: 14px;
              color: #1a82ee;
            }
          }
        }
        .role-info {
          height: calc(100% - 42px);
          .role-form {
            width: 100%;
            background-color: #fafafa;
            padding: 34px 166px 0 100px;
            border-bottom: 1px solid #deeaec;
            .el-form-item {
              display: inline-block;
              color: #323234;
              .el-form-item__label {
                width: 100px !important;
                float: left;
              }
              .el-form-item__content {
                line-height: 30px;
                font-size: 12px;
                margin-left: 10px !important;
                float: left;
                .el-textarea{
                  width: calc(100% + 360px);
                  .el-input__inner {
                    line-height: 30px;
                    height: 30px;
                  }
                }

              }
            }
            .el-form-item.is-required .el-form-item__label:before {
              content: "*";
              color: #f56c6c;
              margin-right: 4px;
            }
          }
          .el-scrollbar {
            // height: 400px;
            height: calc(100% - 180px);
            .el-scrollbar__wrap {
              overflow-y: scroll !important;
              .el-scrollbar__view{
                min-width: 960px;
              }
              .table-checkbox {
                border-top: 1px solid #d0d2d4;
                height: 200px;
                .table-row {
                  height: 50px;
                  border-bottom: #d0d2d4 solid 1px;
                }
              }
            }
          }
          .role-list {
            width: 100%;
            .role-list-li {
              height: 46px;
              line-height: 46px;
              .el-checkbox-group {
                display: flex;
                .el-checkbox {
                  flex: 1;
                }
                .el-checkbox:first-child {
                  background-color: #fef5e6;
                  padding-left: 30px;
                }
              }
            }
          }
        }
      }
      &-checkItem {
        display: flex;
      }
      &-checkLeft {
        background: #fff5e7;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        border-right: 1px solid #f1f1f1;
        color: #766b59;
        border-bottom: 1px solid #f1f1f1;
      }
      &-checkRight {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        color: #323234;
      }
      &-user {
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: left;
        font-size: 14px;
        cursor: pointer;
        box-sizing: content-box;
        color: #323232;
        padding-left: 14px;
      }
      &-user:hover, .active {
        background: #F0F5FA;
        color: #1A82EE;
      }
      .el-checkbox + .el-checkbox {
        margin-left: 0px;
      }
      .el-checkbox {
        padding: 14px 24px;
        color: #323234;
        border-bottom: 1px solid #f1f1f1;
      }
      span.el-checkbox{
        border-right: 1px solid #f1f1f1;
      }
      .panel-warp {
        position: relative;
        z-index: 1;
        width: 306px !important;
        
        .panel-content {
          padding-top: 10px;
        }
      }
    }
</style>
