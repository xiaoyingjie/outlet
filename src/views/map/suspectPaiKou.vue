<template>
  <div :style="{'width': legendShow === true ? 'calc(100% - 210px)' : '100%'}" class="wrap">
    <div id="map"></div>
    <Panel v-if="searchState" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont icon-sousuo"></i>
        查询条件
      </div>
      <div slot="content">
        <div style="padding: 4px 41px 0 24px;">
          <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">行政区划</div>
          <el-cascader
            size="small"
            placeholder="请选择所在地"
            :options="options"
            change-on-select
            clearable
            :props="xzqhprops"
            v-model="selectXzqh"
            :show-all-levels="false"
            style="width: 100%"
            filterable>
          </el-cascader>
          <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">问题编号</div>
          <el-input size="small" v-model="searchInfo.sewagenumber" placeholder="请输入编号"></el-input>
          <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">排查状态</div>
          <el-select size="small" style="width: 100%"  v-model="searchInfo.pcstate" placeholder="请选择排查状态" clearable>
            <el-option
              label="未排查"
              value="0">
            </el-option>
            <el-option
              label="已排查"
              value="1">
            </el-option>
          </el-select>
          <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">入库日期</div>
          <el-date-picker
            size="small"
            style="width: 100%"
            v-model="searchInfo.createtime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
          <div class="item-title" style="height: 32px;line-height: 32px;font-size:12px">描述</div>
          <el-input size="small" v-model="searchInfo.remark" placeholder="请输入描述"></el-input>
        </div>
      </div>
      <div slot="footer">
        <div class="button"><el-button size="small" type="primary" @click="onSearch">查询</el-button></div>
      </div>
    </Panel>
    <Panel v-if="!searchState" v-loading="loading" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont icon-chaxunjieguo"></i>查询结果
        <div class="handle-button" style="float:right">
          <el-button type="text" size="small" @click="NoSearch">返回</el-button>
        </div>
      </div>
      <div style="height: calc(100% - 100px);" class="pwkzh-content" slot="content">
        <div class="cxjg-warp-result">
          <ul class="result-list" v-show="listData && listData.length !== 0">
            <li v-for="(item,index) in listData"
              @click="watchDetail(item)"
              :key="index">
              <div class="result-list-li">
                <div class="result-list-num">
                  <i class="iconfont icon-map_pin"></i>
                  <div class="num">
                    {{ item.num }}
                    <!-- <span>{{(index + 1) + (searchCurrent - 1) * searchInfo.limit}}</span> -->
                  </div>
                </div>
                <div class="result-list-desc">
                  <div>{{ item.address }}</div>
                  <div>{{ item.sewagenumber }} | <span :class="[item.pcstate === '未排查' ? 'font-red' : '']">{{ item.pcstate }}</span></div>
                  <div>{{ item.createtime }}</div>
                </div>
                <div style="clear:both"></div> <!-- 消除form的浮动没有高度问题 -->
              </div>
            </li>
          </ul>
          <div class="zwsj" v-show="!listData || listData.length === 0">
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
            :total="searchTotal">
          </el-pagination>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Vue from 'vue'
  import * as api from '@/store/api'
  import Panel from '@/components/Panel'
  
  export default {
    components: {
      Panel
    },
    data () {
      return {
        options: [], // 所在地配置数据
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        selectXzqh: [],
        searchInfo: {
          checkstate: 2,
          pcstate: '', // 排查状态
          xzqh: '', // 所在地传出值
          remark: '',
          sewagenumber: '', // 疑问问题编号
          createtime: '',  // 创建时间
          limit: 30,
          current: 1
        },
        data: {},
        searchTotal: 0, // 总条数
        loading: false,
        searchState: true,
        listData: [],
        legendShow: false,
        points: []
      }
    },
    created () {
      this.getXzqh()
    },
    mounted () {
      this.initMap()
    },
    methods: {
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
      // 获取所在地
      getXzqh (id) {
        let options = JSON.parse(window.sessionStorage.getItem('ctOptions'))
        if (options) {
          this.options = options
        } else {
          api.getXzqh(id).then(res => {
            this.options = res.data.r.xzqh
            if (res.status === 200 && res.data.c === 1 && res.data.r) {
              this.options = res.data.r.xzqh
              window.sessionStorage.setItem('ctOptions', JSON.stringify(res.data.r.xzqh))
            }
          })
        }
      },
      // 分页
      currentChange (_current) {
        this.searchInfo.current = _current
        this.getSearchList()
      },
      // 查看详情
      watchDetail (item) {
        api.processGetLiuchengInfoByYswtA(item.id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            let detailObj = {
              rowData: item,
              flowData: res.data.r,
              type: 'yspk'
            }
            window.sessionStorage.setItem('detailObj', JSON.stringify(detailObj))
            this.$router.push({name: 'watchDetails'})
          } else {
            this.$message({message: '查询失败，请稍后再试', type: 'error'})
          }
        })
      },
      // 查询列表
      getSearchList () {
        this.points = []
        api.suspectGetPageListA(this.searchInfo).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.listData = res.data.r.data
          //   config.Maps.removeFeatureByLayerName('           ')
          //   config.Maps.removeFeatureByLayerName('point')
          //   if (this.listData.length > 0) {
          //     this.addPoint(this.listData)
          //   }
            this.searchTotal = res.data.r.total
            this.loading = false
            return
          }
          this.listData = []
          this.searchTotal = 0
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      addPoint (data) {
        data.map((item, index) => {
          if (item.lon !== 0 && item.lat !== 0) {
            let coords = HMap.transform.wgs84togcj02(item.ptx, item.pty)
            var x = coords[0]
            var y = coords[1]
            let params = HMap.transform.lonLatToMercator(x, y)
            var obj = {}
            obj['attributes'] = {
              id: item.id,
              style: {
                image: {
                  type: 'icon',
                  image: {
                    imageSrc: require('../../../static/images/icon/rhzpk-dj.png'),
                    imageAnchor: [0.5, 1]
                  }
                }
              },
              selectStyle: {
                image: {
                  type: 'icon',
                  image: {
                    imageSrc: require('../../../static/images/icon/rhzpk-mr.png'),
                    imageAnchor: [0.5, 1]
                  }
                }
              }
            }
            obj['geometry'] = 'POINT (' + params[0] + ' ' + params[1] + ')'
            this.points.push(obj)
          }
        })
        this.addpoints(this.points)
      },
      addpoints (_points) {
        config.Maps.removeFeatureByLayerName('rhzpkPoints')
        config.Maps.addPoints(_points, {
          layerName: 'rhzpkPoints',
          zoomToExtent: true,
          moveable: true
        })
      },
      onSearch () { // 条件查找
        this.loading = true
        this.searchState = false
        this.searchInfo.xzqh = this.selectXzqh[this.selectXzqh.length - 1]
        this.getSearchList()
      },
      NoSearch () {
        // config.Maps.getMap().getView().animate({
        //   center: [12114566.857708992, 4037839.9360650205],
        //   zoom: 5,
        //   duration: 500
        // })
        // config.Maps.removeFeatureByLayerName('rhzpkPoints')
        // config.Maps.removeFeatureByLayerName('questionPoints')
        // config.Maps.removeFeatureByLayerName('rhhlPoints')
        // config.Maps.removeFeatureByLayerName('point')
        this.searchState = true
      }
    },
    computed: {
    },
    watch: {
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  .wrap{
    width: 100%;
    height: 100%;
    position: relative;
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
    #map {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    .search {
      width: 360px;
      height: 40px;
      border-radius: 3px;
      background: #fbfeff;
      position: absolute;
      left: 20px;
      top: 18px;
      z-index: 1000;
      box-shadow: 2px 2px 4px rgba(15, 21, 53, 0.22);
      .searchBox {
        width: 255px;
        height: 40px;
        padding-left: 60px;
        font-size: 12px;
        color: #040e31;
        font-family: $font;
        background:#fbfeff;
        ::-webkit-input-placeholder { /* WebKit browsers */
          font-size: 14px;
          color: #aaa;
        }
        :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
          font-size: 14px;
          color: #aaa;
        }
        ::-moz-placeholder { /* Mozilla Firefox 19+ */
          font-size: 14px;
          color: #aaa;
        }
        :-ms-input-placeholder { /* Internet Explorer 10+ */
          font-size: 14px;
          color: #aaa;
        }
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 20px;
        background: #d4dae0;
        position: absolute;
        top: 10px;
        right: 41px;
      }
      .searchBtn {
        font-size: 18px;
        cursor: pointer;
        color: #2f81eb;
        position: absolute;
        right: 12px;
        top: 10px;
        &:hover {
          color: #88b7f4;
        }
      }
      .close {
        font-size: 14px;
        color: #ddd;
        position: absolute;
        right: 54px;
        top: 12px;
        &:hover {
          color: #aad1ff;
          cursor: pointer;
        }
      }
    }
    .searchList {
      background: #fbfeff;
      position: absolute;
      overflow: hidden;
      left: 20px;
      top: 58px;
      border-top: 1px solid #e3e3e3;
      border-bottom-right-radius: 4px;
      border-bottom-left-radius: 4px;
      box-shadow: 2px 2px 4px rgba(15, 21, 53, 0.22);
      max-height: calc(100% - 88px);
      z-index: 1000;
      .seInfo{
        width: 360px;
        height: 100%;
        overflow: hidden;
        ul {
          width: 360px;
          max-height: 882px;
          overflow: auto;
          li {
            font-family: $fontFamilys;
            font-size: 12px;
            color: #1f123f;
            cursor: pointer;
          }
          .liFirst {
            height: 39px;
            border-bottom: 1px solid #e3e3e3;
            text-align: center;
            line-height: 39px;
            .searchKeyWords {
              color: #ff0000;
            }
          }
          .lists {
            width: 100%;
            height: 32px;
            line-height: 32px;
            .daohang {
              margin-left: 18px;
              font-size: 13px;
              color: #c3c3c3;
            }
            span{
              float: left;
            }
            .navTitle {
              margin-left: 10px;
              font-size: 12px;
              color: #323232;
              font-family: $font;
              display: inline-block;
              width: calc(100% - 80px);
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            &:hover {
              background: #eaebee;
            }
          }
        }
      }
    }
    .map-tools-wrap{
      width: 25px;
      height: auto;
      position: absolute;
      right: 12px;
      bottom: 89px;
      text-align: center;
      span{
        box-shadow: 2px 2px 4px rgba(15, 21, 53, 0.22);
        margin-top: 4px;
        width: 100%;
        height: 25px;
        display: block;
        line-height: 25px;
        background-color: #fff;
        cursor: pointer;
        color: #040e31;
        font-size: 14px;
        &:active {
          color: #2f81eb;
        }
      }
    }
    .map-legends-wrap-legend-img{
      right: 0;
      vertical-align: middle;
      display:table-cell;
      position:absolute;
      top:50%;
      cursor: pointer;
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity 1s
    }
    .fade-enter, .fade-leave-to {
      opacity: 0
    }
    .map-legends-wrap{
      width: 210px;
      position: absolute;
      right: -210px;
      top:0;
      bottom:0;
      background-color: #fff;
      box-shadow: -2px -2px 4px rgba(15, 21, 53, 0.22);
      .map-legends-title{
        height: 49px;
        border-bottom: 1px #eeeeee solid;
        line-height: 49px;
        font-size: 12px;
        font-family: "Microsoft YaHei";
        .mapLeft{
          display: inline-block;
          margin-left: 12px;
          width: 100px;
          height: 48px;
          border-bottom: 1px solid #7FAEEC;
          span:nth-child(1){
            color: #2F81EB;
            margin-left: 20px;
            vertical-align: middle;
          }
          span:nth-child(2){
            color: #1F2844;
            margin-left: 5px;
          }
        }
        .mapRight{
          display: inline-block;
          float: right;
          height: 100%;
          width: 34px;
          background: #2f81eb;
          cursor: pointer;
          text-align: center;
          color: #fff;
          &:hover{
            background: #225eb3;
            color: #b3b6c1;
          }
        }
      }
      .closeLi {
        .map-legends-content-item-box {
          background-color: #a7a9ab !important;
        }
        .map-legends-content-item-content {
          color: #a7a9ab;
        }
      }
      ul li{
        line-height: 32px;
        cursor: pointer;
      }
      .map-legends-content-item-box{
        width: 15px;
        height: 10px;
        display: inline-block;
        margin: 0 15px;
        border-radius: 2px;
      }
      .map-legends-content-item-content{
        font-size: 13px;
        font-family: SimHei;
      }
    }
    .search-wrap-overlay{
      min-width: 100px;
      height: 47px;
      text-align: center;
      position: relative;
      top: -8px;
      left: 0px;
      .search-wrap-overlay-div{
        position: relative;
        left: -8px;
        bottom: 2px;
        .search-wrap-overlay-content{
          color: #FFF;
          height: 40px;
          line-height: 40px;
          padding: 0 10px;
          background-color: #000000;
          opacity: 0.65;
          span:nth-child(2){
            display: inline-block;
            width: auto;
            font-size: 12px;
            color: #4496ff;
            margin: 0 4px;
          }
        }
        .search-wrap-overlay-content-img{
          height: 7px;
          position: absolute;
        }
      }
      .search-wrap-overlay-position{
        width: 100%;
        text-align: center;
      }
    }
    .zwsj {
      position: absolute;
      text-align: center;
      top: 160px;
      width: 100%;
      font-size: 12px
    }
  }
  .ck {
    cursor: pointer;
    text-align: center;
    border-top: 1px solid #ededed;
  }
  .cxjg-warp-result{
    height: calc(100% - 80px);
    min-height: 300px;
    width: 320px;
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
              .font-red{
                color: red;
              }
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
