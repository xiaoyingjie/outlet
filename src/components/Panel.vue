<template>
  <div class="panel-warp" :style="{width: warpWidth}">
    <div class="panel-title" v-if="!noHead">
      <slot name="title"></slot>
    </div>
    <div class="panel-content" :style="{'height': heightTab}">
      <el-scrollbar  :noresize="false" :native="false" style="height: 100%;" :style="heightTab === '100%' ? 'display:none;' : ''">
        <slot name="content"></slot>
      </el-scrollbar>
      <slot name="contentTab"></slot>
    </div>
    <div class="panel-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      warpWidth: {
        type: String,
        default: '320px'
      },
      heightTab: {
        type: String,
        default: 'calc(100% - 100px);'
      },
      noHead: {
        type: Boolean,
        default: false
      }
    },
    components: {},
    data () {
      return {
      }
    },
    watch: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss" type="text/scss">
.panel-warp {
  position: absolute;
  width: 320px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 4px 0px 10px 0px
  rgba(107, 108, 124, 0.2);
  border-radius: 6px 0px 0px 6px;
  font-size: 12px;
  color: #4e5258;
  .panel-title {
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dadbdc;
    padding: 0 16px;
    .icfont {
      color: #1c8ffa;
      padding-right: 10px;
    }
  }
  .panel-content {
    height: calc(100% - 100px);
    // height: calc(100% - 100px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
  .panel-footer {
    border-top: 1px solid #dadbdc;
    height: 60px;
    line-height: 60px;
  }
}
</style>
