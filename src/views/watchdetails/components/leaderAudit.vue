<template>
  <div>
    <Panel :warpWidth="'100%'" heightTab="calc(100% - 40px)" v-loading="loading">
      <div slot="title">
        <i class="icfont iconfont icon-xiangqing1"></i>
        {{ showDetail ? '组长审核详情' : '组长审核' }}
        <div class="handle-button" style="float:right" v-show="showDetail">
          <el-button type="text" size="small" @click="showDetail = false">返回</el-button>
        </div>
      </div>
      <div slot="content">
        <div class="table-wraper" v-show="!showDetail">
          <el-table
            :data="listData"
            @row-click="rowClick"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span :class="[scope.row.checkstate === 1 ? '' : 'readFont']">{{ scope.row.checkstatestr }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="checkername"
              label="审核人">
            </el-table-column>
            <el-table-column
              prop="checktime"
              label="审核时间">
            </el-table-column>
          </el-table>
        </div>
        <div class="wraper-comtent" v-show="showDetail" v-loading="loading1">
          <div class="content-item">
            <div>
              <span class="isd">审核状态</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.checkstatestr"></el-input>
            </div>
            <div>
              <span class="isd">审核人</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.checkername"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">审核人单位</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.jobUnit"></el-input>
            </div>
            <div>
              <span class="isd">审核时间</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.checktime"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div style="width: calc(100% - 100px)">
              <span class="isd">审核意见</span>
              <el-input
                type="textarea"
                :readonly="readonly"
                :rows="3"
                v-model="detailsData.checkremark">
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import * as api from '@/store/api'
  import Panel from '@/components/Panel'
  export default {
    components: {
      Panel
    },
    data () {
      return {
        loading: false,
        loading1: false,
        listData: [],
        zuzhangId: '',
        detailsData: {},
        // ------------
        showDetail: false,
        readonly: true
      }
    },
    computed: {
    },
    created () {
      this.getList()
    },
    methods: {
      getList () {
        this.loading = true
        let id
        let rowdata = JSON.parse(sessionStorage.getItem('detailObj')).rowData
        let type = JSON.parse(sessionStorage.getItem('detailObj')).type
        if (type === 'yspk') {
          id = rowdata.pcid
        } else if (type === 'xcpc') {
          id = rowdata.id
        }
        api.auditGetHeadmanAuditListA(id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.listData = res.data.r.data
            this.loading = false
            return
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      getDetails () {
        this.loading1 = true
        api.auditGetHeadmanAuditDetailA(this.zuzhangId).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.detailsData = res.data.r
            this.loading1 = false
            return
          }
          this.loading1 = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      rowClick (row) {
        this.showDetail = true
        this.zuzhangId = row.id
        this.getDetails()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .table-wraper{
    padding: 20px;
    padding-right: 37px;
    .readFont{
      color: red;
    }
  }
  @import './css/common.scss'
</style>
