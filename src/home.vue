<template>
  <div class="sydxc">
    <div class="header">
      <i>
        <img src="../static/images/header/logo-pwk.png" alt="" style="position: absolute;top: 14px;">
      </i>
      <span class="title">环渤海入海排污口排查支持系统</span>
      <div class="exit_button">
        <!-- <span @click="exit">退出</span> -->
      </div>
    </div>
    <div class="index-content-wrap">
      <index-nav class="nav_warp" :style="flag ? 'width:65px;' : 'width:210px;'"  @leftClose="leftClose" :menu=menu :activeName=activeName></index-nav>
      <div class="index-route" :style="flag === true ? 'left:65px; width:calc(100% - 65px);' : 'left:210px; width:calc(100% - 210px);' ">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>
<script>
  import indexNav from './components/IndexNav'
  // import * as api from './store/api'
  export default {
    data () {
      return {
        flag: false,
        userdetail: {},
        menu: [],
        activeName: 'suspectPaiKou'
      }
    },
    created () {
      let path = this.$route.fullPath.split('/')
      this.activeName = path[path.length - 1]
    },
    mounted () {
      this.menu = JSON.parse(localStorage.getItem('menu'))
      // if (this.$route.path !== '/home') {
      //   this.$router.push({path: this.$route.path, query: this.$route.query})
      // } else if (this.menu[0].children) {
      //   this.menu[0].showChild = true
      //   this.$router.push({path: this.menu[0].children[0].path})
      // } else {
      //   this.$router.push({path: this.menu[0].path})
      // }
      // if (window.localStorage.getItem('userDetail')) {
      //   this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
      // }
      // if (this.$route.name) {
      //   this.activeName = this.$route.name
      // } else if (this.menu[0].children) {
      //   this.activeName = this.menu[0].children[0].name
      // } else {
      //   this.activeName = this.menu[0].name
      // }
    },
    methods: {
      exit () {
        // api.signOut(this.userdetail).then(res => {
        //   if (res.data.c === 1) {
        //     window.location.href = config.appUrl.waterSorceSystem + '/system'
        //   }
        // })
      },
      leftClose (i) {
        this.flag = i
      }
    },
    computed: {
    },
    watch: {
    },
    components: {
      indexNav
    }
  }
</script>

<style lang="scss" type="text/scss">
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  .sydxc {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .header {
      width: 100%;
      height: 58px;
      line-height: 58px;
      background: #1c8ffa;
      position: absolute;
      top: 0;
      z-index: 1;
      box-shadow: 2px 2px 4px rgba(15, 21, 53, 0.22);
      i {
        position: absolute;
        left: 30px;
        color: #fff;
      }
      .title {
        margin-left: 70px;
        font-family: $fontFamily;
        font-size: 20px;
        color: #fff;
      }
      .exit_button {
        float: right;
        color:#fff;
        padding: 5px 10px;
        box-sizing: border-box;
        height: 58px;
        line-height: 48px;
        margin-right: 10px;
        span{
          cursor: pointer;
        }
      }
    }
    .index-content-wrap {
      position: absolute;
      left: 0;
      right: 0;
      top: 58px;
      bottom: 0;
      background: #fff;
      overflow: hidden;
      z-index: 1;
      .nav_warp {
        text-align: left;
        position: absolute;
        width: 210px;
        top: 0;
        left: 0;
        height: calc(100%);
        background-color: #1a202a;
      }
      .index-route {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 210px;
        width: calc(100% - 210px);
      }
    }
  }
  .login_error {
    width: 100%;
    height: 100%;
  }
  .el-table th {
    background: #e4ebf3;
  }
</style>

