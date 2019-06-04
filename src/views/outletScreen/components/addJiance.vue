<template>
  <div class="wraper-editor" v-loading="loading">
    <Panel warpWidth="100%" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont iconedit1"></i>
        添加监测信息
      </div>
      <div slot="content">
        <div class="editor-content">
          <div class="item-content">
            <div>
              <span class="isd">排污口编号</span>
              <el-input readonly size="small" style="width: 240px" v-model="xqCode"></el-input>
            </div>
            <div>
              <span class="isd">样品编号</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.ypcode"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">PH</span>
              <el-input size="small" style="width: 240px" v-model="detailsData.ph"></el-input>
            </div>
            <div>
              <span class="isd">化学需氧量（mg/L）</span>
              <el-input size="small" style="width: 240px" v-model="detailsData.hxxyl"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">总磷（mg/L）</span>
              <el-input size="small" style="width: 240px" v-model="detailsData.zonglin"></el-input>
            </div>
            <div>
              <span class="isd">氨氮（mg/L）</span>
              <el-input size="small" style="width: 240px" v-model="detailsData.andan"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">外观</span>
              <el-input size="small" style="width: 240px" v-model="detailsData.waiguan"></el-input>
            </div>
            <div>
              <span class="isd">填报时间</span>
              <el-date-picker
                size="small"
                :readonly="!isAdd"
                v-model="detailsData.createtime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:SS"
                style="width: 240px"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
          <div class="item-content">
            <div style="width: 100%">
              <span class="isd">备注</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="detailsData.bz">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="content-button">
          <el-button size="small" type="primary" @click="addjiance">确认</el-button>
          <el-button size="small" type="info" @click="$emit('goback')">取消</el-button>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import * as api from '@/store/api'

  export default {
    props: ['xqId', 'xqCode'],
    components: {
      Panel
    },
    data () {
      return {
        value: '',
        loading: false,
        detailsData: {},
        // 是编辑还是添加
        isAdd: false
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        this.loading = true
        api.rhpwkGetMonitorMessageA(this.xqId).then(res => {
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
      },
      addjiance () {
        let args = {
          andan: this.detailsData.andan,
          createtime: this.detailsData.createtime,
          hxxyl: this.detailsData.hxxyl,
          bz: this.detailsData.bz,
          wtid: this.xqId,
          ph: this.detailsData.ph,
          pwkcode: this.detailsData.pwkcode,
          waiguan: this.detailsData.waiguan,
          ypcode: this.detailsData.ypcode,
          zonglin: this.detailsData.zonglin
        }
        if (this.isAdd) {
          args.createrid = JSON.parse(window.localStorage.getItem('userDetail')).userId
        } else {
          args.id = this.detailsData.id
        }
        api.rhpwkSaveMonitorMessageA(args).then(res => {
          this.loading = true
          if (res.status === 200 && res.data.c === 1) {
            this.loading = false
            this.$emit('goback', 1)
            return
          }
          this.loading = false
          this.$message({message: '操作失败请稍后再试', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '操作失败请稍后再试', type: 'warning', duration: 1000})
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .wraper-editor{
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    width: 560px;
    height: 100%;
    z-index: 1000;
    .content-button{
      position: relative;
      background: white;
      left: 0;
      bottom: 2px;
      width: 560px;
      height: 32px;
      text-align: center;
    }
    .editor-content{
      width: 560px;
      height: 100%;
      padding: 4px 28px;
      position: relative;
      .item-content{
        font-size: 12PX;
        overflow: hidden;
        &>div{
          float: left;
          width: calc(50% - 24px);
          margin-top: 12px;
          &:first-child{
          margin-right: 32px;
        }
      }
      div{
        .isd{
          display: block;
          margin-bottom: 10px;
        }
      }
    }
    }
  }
</style>
