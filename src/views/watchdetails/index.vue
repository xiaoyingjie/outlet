<template>
  <div class="flowChart-div">
    <div class="flowChart-left">
      <FlowChart @chooseFlow="chooseFlow"></FlowChart>
    </div>
    <div class="flowChart-middle"></div>
    <div class="flowChart-right">
      <!-- 疑似排口 -->
      <suspected-pwk v-if="activeitem === 'yspk'"></suspected-pwk>
      <!-- 排查详情 -->
      <screen-detalis v-if="activeitem === 'pcxq'"></screen-detalis>
      <!-- 监测详情 -->
      <monitoring v-if="activeitem === 'jcxq'"></monitoring>
      <!-- 组长审核 -->
      <leader-audit v-if="activeitem === 'zzsh'"></leader-audit>
      <!-- 专项办意见 -->
      <special-audit v-if="activeitem === 'zxbyj'"></special-audit>
      <!-- 地方意见 -->
      <place-opinion v-if="activeitem === 'dfyj'"></place-opinion>
      <!-- 专项办确认 -->
      <special-confirm v-if="activeitem === 'zxbqr'"></special-confirm>
    </div>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import FlowChart from '@/views/watchdetails/components/FlowChart'
  import SuspectedPwk from './components/suspectedPwk'
  import screenDetalis from './components/screenDetalis'
  import monitoring from './components/monitoring'
  import leaderAudit from './components/leaderAudit'
  import specialAudit from './components/specialAudit'
  import placeOpinion from './components/placeOpinion'
  import specialConfirm from './components/specialConfirm'
  export default {
    components: {
      Panel,
      FlowChart,
      SuspectedPwk,
      screenDetalis,
      monitoring,
      leaderAudit,
      specialAudit,
      placeOpinion,
      specialConfirm
    },
    data () {
      return {
        activeitem: ''
      }
    },
    activated () {
      // this.activeitem = 'yspk'
    },
    methods: {
      chooseFlow (e) {
        this.activeitem = e
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
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
 
</style>
