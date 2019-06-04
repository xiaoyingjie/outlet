<template>
  <div class="wraper">
    <div id="map"></div>
    <Panel v-if="searchState" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont icon-sousuo"></i>
        查询条件
      </div>
      <div slot="content">
        <div>
          <div style="padding: 4px 41px 0 24px;">
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">排污口名称</div>
            <el-input size="small" v-model="searchInfo.pwkName" placeholder="请输入排污口名称"></el-input>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">是否是排污口</div>
            <el-select size="small" style="width: 100%"  v-model="searchInfo.sfspwk" placeholder="请选择是否是排污口" clearable>
              <el-option
                label="是"
                value="1">
              </el-option>
              <el-option
                label="否"
                value="0">
              </el-option>
            </el-select>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">行政区划</div>
            <el-cascader
              size="small"
              placeholder="请选择行政区划"
              :options="options"
              change-on-select
              clearable
              style="width: 100%"
              :props="xzqhprops"
              v-model="selectXzqh"
              :show-all-levels="false"
              filterable>
            </el-cascader>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">有无关联疑似排口</div>
            <el-select size="small" style="width: 100%"  v-model="searchInfo.sewagestate" placeholder="请选择有无关联疑似排口" clearable>
              <el-option
                label="有"
                value="1">
              </el-option>
              <el-option
                label="无"
                value="0">
              </el-option>
            </el-select>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">排查阶段</div>
            <el-select size="small" style="width: 100%"  v-model="searchInfo.checklevel" placeholder="请选择排查阶段" clearable>
              <el-option
                label="二级排查"
                :value="1">
              </el-option>
              <el-option
                label="三级排查"
                :value="2">
              </el-option>
            </el-select>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">排污口类型</div>
            <el-select size="small" style="width: 100%"  v-model="searchInfo.pwklx" placeholder="请选择类型" clearable>
              <el-option
                v-for="(item, index) in pwkOptions"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
            <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">描述</div>
            <el-input size="small" v-model="searchInfo.remark" placeholder="请输入描述"></el-input>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="button"><el-button size="small" type="primary" @click="onSearch">查询</el-button></div>
      </div>
    </Panel>
    <Panel v-if="!searchState" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont icon-chaxunjieguo"></i>查询结果
        <div class="handle-button" style="float:right">
          <el-button type="text" size="small" @click="searchState = true">返回</el-button>
        </div>
      </div>
      <div style="height: calc(100% - 100px);" class="pwkzh-content" slot="content">
        <div class="cxjg-warp-result" v-loading="loading">
          <ul class="result-list" v-show="listData.length !== 0">
            <li 
              v-for="(item, index) in listData"
              :key="index"
              @click="watchDetails(item)">
              <div class="result-list-li">
                <div class="result-list-num">
                  <i class="iconfont icon-map_pin"></i>
                  <div class="num">{{ item.num }}</div>
                </div>
                <div class="result-list-desc">
                  <div>{{ item.pwkName }}</div>
                  <div>{{ item.address }} <span v-show="item.address && item.checklevel">|</span> {{ item.checklevel }}</div>
                  <div>{{ item.createtime }}</div>
                </div>
                <div style="clear:both"></div> <!-- 消除form的浮动没有高度问题 -->
              </div>
            </li>
          </ul>
          <div class="zwsj" v-show="listData.length === 0">
            暂无数据
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="pagination">
           <el-pagination
            small
            layout="prev, pager, next"
            :current-page="searchInfo.searchCurrent"
            :page-size="searchInfo.limit"
            :page-count="7"
            @current-change="currentChange"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import Vue from 'vue'
  import { getXzqhA } from '@/mk'
  import * as api from '@/store/api'

  export default {
    components: {
      Panel
    },
    data () {
      return {
        searchState: true,
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        pwkOptions: [],
        searchInfo: {
          pwkName: '',
          pwklx: '',
          sewagestate: '',
          sfspwk: '',
          checklevel: '',
          remark: '',
          limit: 30,
          current: 1
        },
        selectXzqh: [],
        options: [],
        total: 0,
        listData: [],
        loading: false
      }
    },
    created () {
      this.options = getXzqhA()
      this.getTypepwk()
    },
    mounted () {
      this.initMap()
    },
    methods: {
      // 排污口类型
      getTypepwk () {
        api.rhpwkGetEnumA('04').then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.pwkOptions = res.data.r
            return
          }
          this.$message({message: '排污口类型获取异常', type: 'warning', duration: 1000})
        })
      },
      getList () {
        this.loading = true
        this.searchInfo.xzqh = this.selectXzqh[this.selectXzqh.length - 1] || ''
        api.rhpwkGetPageListA(this.searchInfo).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.listData = res.data.r.data
            this.total = res.data.r.total
            this.loading = false
            return
          }
          this.total = 0
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      onSearch () {
        this.getList()
        this.searchState = false
      },
      currentChange (val) {
        this.searchInfo.current = val
        this.getList()
      },
      // 初始化地图
      initMap () {
        const Maps = new HMap('map', config.mapConfig)
        Maps.on('loadMapSuccess', event => {
          if (event) {
            this.$store.dispatch('actionMapState', true)
            Vue.prototype.$Maps = Maps
            config.Maps = Maps
          } else {
            this.$store.dispatch('actionMapState', false)
            throw new Error('地图加载失败！')
          }
        })
      },
      watchDetails (item) {
        api.processGetLiuchengInfoByCheckA(item.id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            let detailObj = {
              rowData: item,
              flowData: res.data.r,
              type: 'xcpc'
            }
            window.sessionStorage.setItem('detailObj', JSON.stringify(detailObj))
            this.$router.push({name: 'watchDetails'})
          } else {
            this.$message({message: '查询失败，请稍后再试', type: 'error'})
          }
        })
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .wraper{
    $fontFamily: "SimHei";
    $fontFamilys: "Microsoft YaHei";
    $font: "SimSun";
    $ST: '宋体';
    #map {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .button{
      position: relative;
      text-align: center;
      width: 100%;
      background: white;
      height: 32px;
      left: 0;
      bottom: 30px
    }
    .el-form-item{
      margin-bottom: 0;
      width: 300px;
    }
    .cxjg-warp-result{
      height: calc(100% - 80px);
      min-height: 300px;
      width: 320px;
      .zwsj {
        position: absolute;
        text-align: center;
        top: 160px;
        width: 320px;
        font-size: 12px
      }
      .result-list{
        li{
          list-style: none;
          height: 96px;
          padding: 10px 12px 10px;
          cursor: pointer;
          &:hover{
            background-color: #f0f4f8;
            .result-list-desc{
            }
          }
          .result-list-li {
            position: relative;
            height: 100%;
            width: 100%;
            .result-list-num{
              display: inline-block;
              width: 26px;
              height: 100%;
              left: 0;
              position: absolute;
              span{
                font-family: SimHei;
              }
              .iconfont {
                font-size: 26px;
                position: absolute;
                left: 2px;
                top: 6px;
                color: #eb4f38
              }
              .num {
                width: 26px;
                position: absolute;
                text-align: center;
                top: 12px;
                left: 2px;
                span {
                  font-size: 12px;
                  color: #fff
                }
              }
            }
            .result-list-desc{
              width: calc(100% - 30px);
              height: calc(100% - 16px);
              right: 0;
              top: 10px;
              position: absolute;
              .tab {
                position: absolute;
                right: 20px;
                top: 0px;
                color: #6caf59;
              }
              div{
                text-overflow:ellipsis;
                font-family: SimHei;
                font-size: 12px;
                height: 20px;
                &:first-child{
                  color: #000;
                  font-weight: bold;
                }
                // line-height: 28px;
                &.result-list-desc-name{
                  span{
                    color:#666;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .pagination{
    text-align: center;
    position: absolute;
    left: 0;
    bottom: -24px;
    width: 320px;
    height: 70px;  
    background: #fff;  
    z-index:100;
  }
</style>
