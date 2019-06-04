<template>
  <div class="wraper-editor" v-loading="loading">
    <Panel warpWidth="100%" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont iconedit1"></i>
        编辑页
      </div>
      <div slot="content">
        <div class="editor-content">
          <div class="item-content">
            <div>
              <span class="isd">所在地</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.address"></el-input>
            </div>
            <div>
              <span class="isd">问题编号</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.sewagenumber"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">经度</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.ptxstr"></el-input>
            </div>
            <div>
              <span class="isd">纬度</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.ptystr"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">行政区划</span>
              <el-cascader
                size="small"
                :options="options"
                change-on-select
                clearable
                :props="xzqhprops"
                v-model="selectXzqh"
                :show-all-levels="false"
                style="width: 240px"
                filterable>
              </el-cascader>
            </div>
            <div>
              <span class="isd">创建人</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.createrName"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">创建时间</span>
              <el-input size="small" readonly style="width: 240px" v-model="detailsData.createtime"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div style="width: 100%">
              <span class="isd">描述</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="detailsData.remark">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="content-button">
          <el-button size="small" type="primary" @click="editorDetails">确认</el-button>
          <el-button size="small" type="info" @click="$emit('goback')">取消</el-button>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import * as api from '@/store/api'
  import { getXzqhA } from '@/mk'

  export default {
    props: ['xqId'],
    components: {
      Panel
    },
    data () {
      return {
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        options: [],
        selectXzqh: [],
        loading: false,
        detailsData: {}
      }
    },
    created () {
      this.getDetails()
      this.options = getXzqhA()
    },
    methods: {
      // 详情查询
      getDetails () {
        this.loading = true
        api.suspectGetDetailA(this.xqId).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.detailsData = res.data.r
            this.selectXzqh = this.dealXzqu(res.data.r.xzqh)
            this.loading = false
            return
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      // 编辑详情
      editorDetails () {
        let args = {
          createrid: '',
          createtime: '',
          id: this.detailsData.id,
          ptx: 0,
          pty: 0,
          remark: this.detailsData.remark,
          sewagenumber: 0,
          xzqh: this.selectXzqh[this.selectXzqh.length - 1] || ''
        }
        api.suspectUpdateSupectA(args).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$emit('goback', 1)
            return
          }
          this.$message({message: '编辑失败', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      dealXzqu (code) {
        code += ''
        let arr
        let f = code.substr(0, 2)
        let s = code.substr(2, 2)
        let t = code.substr(4, 2)
        if (s === '00') {
          arr = [code]
          return arr
        }
        if (t === '00') {
          let r1 = f + '0000'
          arr = [r1, code]
          return arr
        }
        let r1 = f + '0000'
        let r2 = f + s + '00'
        arr = [r1, r2, code]
        return arr
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
