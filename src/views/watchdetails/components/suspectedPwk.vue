<template>
  <div>
    <Panel :warpWidth="'100%'" heightTab="calc(100% - 40px)" v-loading="loading">
      <div slot="title">
        <i class="icfont iconfont icon-xiangqing1"></i>
        疑似排口详情
      </div>
      <div slot="content">
        <div class="wraper-comtent">
          <div class="content-item">
            <div>
              <span class="isd">所在地</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.address"></el-input>
            </div>
            <div>
              <span class="isd">问题编号</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.sewagenumber"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">经度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.ptxstr"></el-input>
            </div>
            <div>
              <span class="isd">纬度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.ptystr"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">排查状态</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.pcstate"></el-input>
            </div>
            <div>
              <span class="isd">创建人</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.createrName"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">创建时间</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.createtime"></el-input>
            </div>
            <div>
              <span class="isd">描述文字</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.remark"></el-input>
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
        readonly: true,
        detailsData: {}
      }
    },
    computed: {
    },
    created () {
      this.getDetails()
    },
    activated () {
      this.getDetails()
    },
    methods: {
      // 详情查询
      getDetails () {
        this.loading = true
        let id
        let rowdata = JSON.parse(sessionStorage.getItem('detailObj')).rowData
        let type = JSON.parse(sessionStorage.getItem('detailObj')).type
        if (type === 'yspk') {
          id = rowdata.id
        } else if (type === 'xcpc') {
          id = rowdata.sewageid
        }
        api.suspectGetDetailA(id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.detailsData = res.data.r
            this.loading = false
            return
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import './css/common.scss'
</style>
