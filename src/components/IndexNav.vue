<template>
  <!-- 导航栏 -->
  <div class="index-nav clearfix">
    <el-scrollbar
      tag="div"
      class="nav-scrollbar"
      wrap-class="nav-dropdown__wrap"
      view-class="nav-dropdown__list">
      <el-menu
        :default-active="activeName"
        :default-openeds="openName"
        @select="menuSelect"
        :collapse="isCollapse"
        class="el-menu-nav clearfix"
        background-color="#1a202a"
        text-color="rgba(255,255,255,.45)"
        active-text-color="#fff">
        <div v-for="(item, index) in menu" :key="index">
          <el-submenu :class="isCollapse ? 'elSubmenu-index' : ''" :index="item.name" :key="item.name"  v-if="item.children !== undefined">
            <template slot="title">
              <i :class="'icfont iconfont ' + item.iconclass"></i>
              <span slot="title" v-if="!isCollapse">{{item.mkname}}</span>
            </template>
            <div v-for="(i, index) in item.children" :key="index" class="item-child">
              <el-menu-item :index="i.name" :key="i.name"><i :class="'icfont iconfont ' + i.icon"></i> {{i.mkname}}</el-menu-item>
            </div>
          </el-submenu>
          <el-menu-item :index="item.name" v-if="item.children === undefined">
            <i :class="'icfont iconfont ' + item.icon"></i>
            <template slot="title"><span slot="title"> {{item.mkname}} </span></template>
          </el-menu-item>
        </div>
        <!-- <div>
          <el-submenu class="elSubmenu-index" index="1">
            <template slot="title">
              <i class="icfont iconfont icondianziditu"></i>
              <span slot="title" v-if="!isCollapse">电子地图</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="suspectPaiKou">疑似排口</el-menu-item>
              <el-menu-item index="theScreen">现场排查</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu class="elSubmenu-index" index="2">
            <template slot="title">
              <i class="icfont iconfont iconpaiwukoupaicha"></i>
              <span slot="title" v-if="!isCollapse">排污口排查</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="yOutlet">疑似排口</el-menu-item>
              <el-menu-item index="pOutlet">现场排查</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu class="elSubmenu-index" index="3">
            <template slot="title">
              <i class="icfont iconfont icon-yonghuliebiao"></i>
              <span slot="title" v-if="!isCollapse">系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="role">角色管理</el-menu-item>
              <el-menu-item index="user">用户管理</el-menu-item>
              <el-menu-item index="unit">组织机构管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </div> -->
      </el-menu>
    </el-scrollbar>
    <div class="kaiguan" :style="isCollapse === true ? 'width:65px;' : 'width:210px;' " @click="openMenu(isCollapse)">
      <i class="icfont iconfont icon-bbcxydc-sydjbqktjb"></i></div>
  </div>
</template>

<script>
  export default {
    props: {
      menu: {
        type: Array,
        default () {
          return []
        }
      },
      activeName: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        openName: [],
        isCollapse: false
      }
    },
    created () {
    },
    beforeMount () {
    },
    mounted () {
      this.setOpenName()
    },
    watch: {
      activeName () {
        this.$router.push({name: this.activeName})
      }
    },
    methods: {
      openMenu (flag) {
        this.isCollapse = !flag
        this.$emit('leftClose', this.isCollapse)
      },
      menuSelect (name) {
        // window.sessionStorage.setItem('menuSelect', name)
        this.$router.push({name: name})
      },
      setOpenName () {
        // this.openName.push('map')
        this.menu.map(item => {
          if (item.children !== undefined) {
            item.children.map(i => {
              if (i.name === this.activeName) {
                this.openName.push(item.name)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .index-nav {
    .nav-scrollbar {
      height: calc(100% - 48px);
      width: 210px;
      .nav-dropdown__wrap {
        height: calc(100% + 15px);
      }
      .el-menu-nav {
        border-right: none!important;
        .el-submenu__title {
          span {
            color: rgba(255, 255, 255, 0.45) !important;
          }
          i {
            margin-right: 4px;
          }
          &:hover {
            background-color: #0a121a;
            span {
              color: #fff !important;
            }
            i {
              color: #fff !important;
            }
          }
        }
        .el-menu-item {
          border-left: 3px solid #131922;
          &:hover {
            color: #fff !important;
            background-color: #0a121a;
            i {
              color: #fff !important;
            }
          }
        }
        .el-menu-item.is-active {
          background: #0a121a !important;
          border-left: 3px solid #1c8ffa;
        }
        .elSubmenu-index {
          .el-icon-arrow-right {
            display: none;
          }
        }
        &:not(.el-menu--collapse) {
          width: 209px;
          min-height: 400px;
        }
      }
      .is-active {
        .el-submenu__title {
          background-color: #0a121a !important;
          color: #fff !important;
          i {
            color: #fff  !important;
          }
          span {
            color: #fff !important;
          }
        }
      }
    }
    .kaiguan {
      width: 210px;
      height: 48px;
      position: absolute;
      bottom: 0;
      line-height: 48px;
      text-align: center;
      cursor: pointer;
      color: rgb(155, 178, 199);
      background: #131922;
    }
  }
</style>
