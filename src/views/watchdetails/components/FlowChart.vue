<template>
  <Panel class="flowChart-left" heightTab="calc(100% - 40px)">
    <div slot="title">
      <i class="icfont iconfont icon-liucheng"></i>
      流程图
      <div class="handle-button" style="float:right">
        <el-button type="text" size="small" @click="returnPage">返回</el-button>
      </div>
    </div>
    <div slot="content"  class="panel-content" style="width: 320px; padding-bottom: 20px">
      <div v-if="flowData.yswtid">
        <div class="item-content" @click="chooseFlow('yspk', 1)">
          <i class="icfont iconfont iconyisipaikou"></i>
          <span :class="[ activeState === 'yspk' ? 'isactived' : '' ]">疑似排口</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div class="inner-menu">
        <div class="wrap-menu">
          <div class="title-menu">现场排查（{{ flowData.checklevel === 2 ? '三级' : '二级' }}）</div>
          <div class="content-menu">
            <div class="inner-submenu" @click="chooseFlow('pcxq', flowData.isaddrhpwk)">
              <i class="icfont iconfont iconpaichaxiangqing" :class="[ flowData.isaddrhpwk > 0 ? '' : 'gray' ]"></i>
              <span :class="[ activeState === 'pcxq' ? 'isactived' : '' ]">排查详情</span>
            </div>
            <div class="inner-submenu" @click="chooseFlow('jcxq', flowData.isaddjc)">
              <i class="icfont iconfont iconpaiwukoujiance" :class="[ flowData.isaddjc > 0 ? '' : 'gray' ]"></i>
              <span :class="[ activeState === 'jcxq' ? 'isactived' : '' ]">监测详情</span>
            </div>
          </div>
        </div>
      </div>
      <img src="static/images/check/u387.png" alt>
      <div v-if="flowData.checklevel !== 2">
        <div class="item-content" @click="chooseFlow('zzsh', flowData.zzshnum)">
          <i class="icfont iconfont iconshenheshenpi" :class="[ flowData.zzshnum > 0 ? '' : 'gray' ]"></i>
          <span :class="[ activeState === 'zzsh' ? 'isactived' : '' ]">组长审核</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div v-if="flowData.checklevel !== 2">
        <div class="item-content" @click="chooseFlow('zxbyj', flowData.zxbshnum)">
          <i class="icfont iconfont iconyijianfankui" :class="[ flowData.zxbshnum > 0 ? '' : 'gray' ]"></i>
          <span :class="[ activeState === 'zxbyj' ? 'isactived' : '' ]">专项办意见</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div>
        <div class="item-content" @click="chooseFlow('dfyj', flowData.dfyjnum)">
          <i class="icfont iconfont iconedit1" :class="[ flowData.dfyjnum > 0 ? '' : 'gray' ]"></i>
          <span :class="[ activeState === 'dfyj' ? 'isactived' : '' ]">地方意见</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div>
        <div class="item-content" @click="chooseFlow('zxbqr', flowData.zxbqrnum)">
          <i class="icfont iconfont iconzhuanxiangbanqueren" :class="[ flowData.zxbqrnum > 0 ? '' : 'gray' ]"></i>
          <span :class="[ activeState === 'zxbqr' ? 'isactived' : '' ]">专项办确认</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div>
        <div class="item-content gray" @click="chooseFlow('yswt')">
          <i class="icfont iconfont iconpaiwukoujiance"></i>
          <span>监测</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div>
        <div class="item-content gray" @click="chooseFlow('yswt')">
          <i class="icfont iconfont iconpaiwukousuyuan"></i>
          <span>溯源</span>
          <img src="static/images/check/u387.png" alt>
        </div>
      </div>
      <div class="inner-menu">
        <div class="wrap-menu">
          <div class="title-menu">整改</div>
          <div class="content-menu">
            <div class="inner-submenu" @click="chooseFlow('zglb')">
              <i class="gray iconfont icontongjibaobiao"></i>
              <span>整改方案</span>
            </div>
            <div class="inner-submenu" @click="chooseFlow('zgqk')">
              <i class="gray iconfont iconzhenggaijindu"></i>
              <span>整改进度</span>
            </div>
            <div class="inner-submenu" @click="chooseFlow('gfjbqk')">
              <i class="gray iconfont iconshenqingxiaohao"></i>
              <span>申请销号</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="item-content gray">
          <img src="static/images/check/u387.png" alt>
          <i class="icfont iconfont iconshenheshenpi"></i>
          <span>销号审批</span>
        </div>
        <div class="item-content gray">
          <img src="static/images/check/u387.png" alt>
          <i class="icfont iconfont iconrichangguanli"></i>
          <span>日常管理</span>
        </div>
      </div>
    </div>
  </Panel>
</template>

<script>
  import Panel from '@/components/Panel'
  export default {
    data () {
      return {
        activeState: '',
        flowData: {}
      }
    },
    activated () {
      this.flowData = JSON.parse(sessionStorage.getItem('detailObj')).flowData
      if (!this.flowData.yswtid) {
        this.activeState = 'pcxq'
        this.$emit('chooseFlow', 'pcxq')
        return
      }
      this.activeState = 'yspk'
      this.$emit('chooseFlow', 'yspk')
    },
    computed: {
    },
    watch: {
    },
    methods: {
      returnPage () {
        this.$router.go(-1)
      },
      chooseFlow (item, num) {
        if (!num) {
          return
        }
        this.activeState = item
        this.$emit('chooseFlow', item)
      }
    },
    components: {
      Panel
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
.flowChart-div {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 20px;
  .flowChart-left {
    position: relative;
    background: #fff;
    width: 320px;
    height: 100%;
    .el-scrollbar__view {
      padding-top: 20px;
      .panel-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .flowChart-middle {
    position: relative;
    width: 20px;
    height: 100%;
  }
  .flowChart-right {
    position: relative;
    background: #fff;
    width: calc(100% - 340px);
    height: 100%;
  }
}

.line {
  border-left: 1px solid #999;
  margin-right: 5px;
}
.panel-content {
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .item-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;
    .icfont {
      color: #1c8ffa;
      font-size: 28px;
    }
    .gray{
      color: #b8b8b8;
      font-size: 28px;
    }
  }
  .gray{
    .icfont {
      color: #b8b8b8;
      font-size: 28px;
    }
  }
  .isactived{
    color: #1c8ffa;
  }
  .inner-menu {
    width: 272px;
    border: 1px solid #dadbdc;
    .title-menu {
      height: 34px;
      line-height: 34px;
      border-bottom: 1px solid #dadbdc;
      padding: 0 10px;
      text-align: center;
      .icfont {
        color: #1c8ffa;
        padding-right: 10px;
      }
    }
    .content-menu {
      .inner-submenu {
        display: flex;
        flex-direction: column;
        width: 134px;
        align-items: center;
        padding: 10px;
        float: left;
        cursor: pointer;
        .icfont {
          color: #1c8ffa;
          font-size: 28px;
        }
        .gray{
          color: #b8b8b8;
          font-size: 28px;
        }
      }
    }
  }
}
</style>
