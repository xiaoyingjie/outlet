<template>
  <div class="system-page">
    <div class="system-content">
      <div class="system-head">
        <span>生态环境执法技术支持系统</span>
      </div>
      <div class="system-page-child">
        <ul>
          <li @click="clickpage(item)" v-for="(item, index) in data" :key="index">
            <div class="images">
              <i :class="item.iconname"></i>
            </div>
            <span>  {{ item.systemname }}  </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from './store/api'
  import { mkTree } from './mk'
  export default {
    data () {
      return {
        data: [],
        userdetail: {}
      }
    },
    mounted () {
      if (window.localStorage.getItem('userDetail')) {
        this.userdetail = JSON.parse(window.localStorage.getItem('userDetail'))
      }
      this.data = this.userdetail.systemQxList
    },
    methods: {
      clickpage (item) {
        // window.location.href = item.systemurl
        switch (item.iconname) {
          case 'qfxd':
            this.getRoleMoudleListNew(item.roleid)
            break
          case 'rhk':
            window.location.href = 'http://localhost:8085/#/index/pwk'
            break
        }
      },
      getRoleMoudleListNew (roleId) {
        api.getRoleMoudleListNew(roleId).then(res => {
          if (res.data.r && res.data.r.data && res.data.r.data[0] && res.data.r.data[0].zj) {
            this.checkJs(res.data.r.data)
          } else {
            this.$confirm('该用户目前无角色，请联系系统管理员分配角色权限!', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
              this.$router.push({path: '/login'})
            })
          }
        })
      },
      checkJs (mks) {
        let menu = mkTree(mks)
        window.localStorage.setItem('mks', JSON.stringify(mks))
        window.localStorage.setItem('menu', JSON.stringify(menu))
        let addRoutes = [{
          path: '/home',
          component: require('./home.vue'),
          name: '',
          isMenu: true,
          children: menu
        }]
        this.$router.addRoutes(addRoutes)
        this.$router.push({path: '/home'})
      }
    },
    computed: {
    },
    watch: {
    },
    components: {
    }
  }
</script>

<style lang="scss" type="text/scss">
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  .system-page {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background: url(../static/images/system-page/background.png);
    background-size:100% 100%;
    .system-content {
      padding: 10px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 5px;
      transform: translate(-50%,-50%);
      .system-head {
        height: 200px;
        line-height: 30px;
        text-align: center;
        span {
          background: url("../static/images/system-page/logo.png") no-repeat;
          width: 425px;
          height: 32px;
          font-family: SimHei;
          font-size: 34px;
          font-weight: normal;
          font-stretch: normal;
          line-height: 32px;
          letter-spacing: 2px;
          color: #ffffff;
          background-size: 34px, 34px;
          padding: 0 50px;
        }
      }
      .system-page-child {
        ul {
          display: inline-flex;
          width: 100%;
          height: 100%;
          li {
            align-content: flex-start;
            text-align: center;
            color: #1b2de8;
            margin: 0 10px;
            cursor: pointer;
            width: 240px;
            height: 280px;
            background-color: #ffffff;
            box-shadow: 2px 4px 10px 0px rgba(107, 108, 124, 0.2);
            border-radius: 4px;
            .images {
              width: 100%;
              text-align: center;
              height: 96px;
              margin: 50px 0;
              i {
                display: inline-block;
                width: 96px;
                height: 96px;
              }
              .syd {
                background: url("../static/images/system-page/syygzfxt(logo).png") no-repeat;
              }
              .qfxd {
                background: url("../static/images/system-page/syygzfxt(logo).png") no-repeat;
              }
              .cjjjd {
                background: url("../static/images/system-page/cjjjd(logo).png") no-repeat;
              }
              .xtgl {
                background: url("../static/images/system-page/xtgl(logo).png") no-repeat;
              }
              .rhk {
                background: url("../static/images/system-page/rhpwkpczcxt(logo).png") no-repeat;
              }
            }
            span {
              height: 50px;
              font-family: MicrosoftYaHei-Bold;
              font-size: 18px;
              color: #4f565d;
              width: 150px;
              display: inline-block;
            }
            &:hover {
              span {
                color: #1c8ffa;
              }
            }
          }
        }
      }
    }
  }
</style>

