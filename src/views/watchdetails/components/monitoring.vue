<template>
  <div>
    <Panel :warpWidth="'100%'" heightTab="calc(100% - 40px)" v-loading="loading">
      <div slot="title">
        <i class="icfont iconfont icon-xiangqing1"></i>
        监测详情
      </div>
      <div slot="content">
        <div class="wraper-comtent">
          <div class="content-item">
            <div>
              <span class="isd">排污口编号</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="code"></el-input>
            </div>
            <div>
              <span class="isd">样品编号</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.ypcode"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">PH</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.ph"></el-input>
            </div>
            <div>
              <span class="isd">化学需氧量（mg/L）</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.hxxyl"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">总磷（mg/L）</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.zonglin"></el-input>
            </div>
            <div>
              <span class="isd">氨氮（mg/L）</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.andan"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">外观</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.waiguan"></el-input>
            </div>
            <div>
              <span class="isd">填报人</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.creatername"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">填报单位</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="detailsData.jobUnit "></el-input>
            </div>
            <div>
              <span class="isd">填报时间</span>
              <el-date-picker
                size="small"
                :readonly="readonly"
                style="width: 300px"
                v-model="detailsData.createtime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:SS"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="content-item">
            <div style="width: calc(100% - 100px)">
              <span class="isd">备注</span>
              <el-input
                type="textarea"
                :rows="3"
                :readonly="readonly"
                placeholder="请输入内容"
                v-model="detailsData.bz">
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
        readonly: true,
        loading: false,
        code: JSON.parse(sessionStorage.getItem('detailObj')).rowData.code,
        detailsData: {}
      }
    },
    computed: {
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        this.loading = true
        let id
        let rowdata = JSON.parse(sessionStorage.getItem('detailObj')).rowData
        let type = JSON.parse(sessionStorage.getItem('detailObj')).type
        if (type === 'yspk') {
          id = rowdata.pcid
        } else if (type === 'xcpc') {
          id = rowdata.id
        }
        api.rhpwkGetMonitorMessageA(id).then(res => {
          if (res.status === 200 && res.data.c === 1 && res.data.r) {
            this.detailsData = res.data.r
            this.loading = false
            return
          }
          this.loading = false
          this.isAdd = true
        }).catch(error => {
          console.log(error)
          this.$message({message: '暂时没有详情', type: 'warning', duration: 1000})
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import './css/common.scss'
</style>
