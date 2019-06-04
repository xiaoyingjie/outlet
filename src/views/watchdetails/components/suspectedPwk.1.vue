<template>
  <div>
    <Panel :warpWidth="'100%'" heightTab="calc(100% - 40px)">
      <div slot="title">
        <i class="icfont iconfont icon-xiangqing1"></i>
        疑似排口详情
      </div>
      <div slot="content">
        <div class="wraper-comtent">
          <div class="content-item">
            <div>
              <span class="isd">所在地</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
            <div>
              <span class="isd">问题编号</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">经度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
            <div>
              <span class="isd">纬度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">排查状态</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
            <div>
              <span class="isd">创建人</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">创建时间</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
            <div>
              <span class="isd">描述文字</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="value"></el-input>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  // import * as api from '@/store/api'
  import Panel from '@/components/Panel'
  export default {
    components: {
      Panel
    },
    data () {
      return {
        value: '',
        readonly: false
      }
    },
    computed: {
    },
    created () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  @import './css/common.scss'
</style>
