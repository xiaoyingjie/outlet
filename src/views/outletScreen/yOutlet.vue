<template>
  <div class="wraper-yOutlet" v-loading="loading">
    <Panel :noHead="true" warpWidth="calc(100% - 32px)" heightTab="calc(100% - 60px)" style="height:calc(100% - 32px)">
      <div slot="content" style="position: relative;">
        <div class="searchhead">
          <div class="search-item">
            <span>所在地</span>
            <el-cascader
              size="small"
              placeholder="请选择所在地"
              :options="options"
              change-on-select
              clearable
              :props="xzqhprops"
              v-model="selectXzqh"
              :show-all-levels="false"
              style="width: 180px"
              filterable>
            </el-cascader>
          </div>
          <div class="search-item">
            <span>问题编号</span>
            <el-input size="small" style="width: 180px" v-model="searchInfo.sewagenumber" placeholder="请输入描述"></el-input>
          </div>
          <div class="search-item">
            <span>排查状态</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.pcstate" placeholder="请选择">
              <el-option
                label="未排查"
                value="0">
              </el-option>
              <el-option
                label="已排查"
                value="1">
              </el-option>
            </el-select>
          </div>
          <div class="button-wrap">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            <div class="icon-wrap" @click="zhankaiState = !zhankaiState">
              <span v-show="zhankaiState">展开</span>
              <i v-show="zhankaiState" class="el-icon-arrow-down"></i>
              <span v-show="!zhankaiState">闭合</span>
              <i v-show="!zhankaiState" class="el-icon-arrow-up"></i>
            </div>
          </div>
        </div>
        <div class="searchhead searchheadA" v-show="!zhankaiState" style="padding-top: 0 16px">
          <div class="search-item">
            <span>入库日期</span>
            <el-date-picker
              style="width: 180px"
              size="small"
              v-model="searchInfo.createtime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="search-item">
            <span>描述</span>
            <el-input size="small" style="width: 180px" v-model="searchInfo.remark" placeholder="请输入描述"></el-input>
          </div>
        </div>
        <div class="table-wrap">
          <el-table
            :data="tableData"
            :row-style="rowStyle"
            @row-click="rowClick"
            style="width: 100%">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">编辑详情</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row)" type="text"><i class="icfont iconfont iconedit1"></i></el-button>
                </el-popover>
                <!-- <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">查看详情</div>
                  <el-button slot="reference" style="font-size: 12px;" type="text" @click.stop="watchDetails(scope.row)"><i class="icfont iconfont iconzhuanxiangbanqueren"></i></el-button>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column
              prop="address"
              label="所在地">
            </el-table-column>
            <el-table-column
              prop="sewagenumber"
              label="问题编号">
            </el-table-column>
            <el-table-column
              label="排查状态">
              <template slot-scope="scope">
                <div class="statecla" :class="[ scope.row.pcstate === '未排查' ? 'isred' : '' ]">{{ scope.row.pcstate }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="ptxstr"
              label="经度">
            </el-table-column>
            <el-table-column
              prop="ptystr"
              label="纬度">
            </el-table-column>
            <el-table-column
              prop="xzqh"
              label="行政区划">
            </el-table-column>
            <el-table-column
              prop="createrName"
              label="创建人">
            </el-table-column>
            <el-table-column
              prop="createtime"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="描述">
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer">
        <div class="w-footer">
          <span class="line"></span>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="searchInfo.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
    <transition name="editor-wrap">
      <editorY v-if="showbian" :xqId="xqId" @goback="goback"></editorY>
    </transition>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import editorY from './components/editorYoutlet'
  import * as api from '@/store/api'
  import { getXzqhA } from '@/mk'

  export default {
    components: {
      Panel,
      editorY
    },
    data () {
      return {
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        rowStyle: {
          cursor: 'pointer'
        },
        options: [],
        zhankaiState: true,
        showbian: false,
        selectXzqh: [],
        loading: false,
        searchInfo: {
          checkstate: 2,
          pcstate: '', // 排查状态
          xzqh: '', // 所在地传出值
          remark: '',
          sewagenumber: '', // 疑问问题编号
          createtime: '',  // 创建时间
          limit: 5,
          current: 1
        },
        xqId: '',
        total: 0,
        tableData: []
      }
    },
    created () {
      this.getList()
      this.options = getXzqhA()
    },
    methods: {
      goback (val) {
        this.showbian = false
        if (val === 1) {
          this.getList()
        }
      },
      search () {
        this.getList()
      },
      // 获取列表
      getList () {
        this.loading = true
        this.searchInfo.xzqh = this.selectXzqh[this.selectXzqh.length - 1] || ''
        api.suspectGetPageListA(this.searchInfo).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.tableData = res.data.r.data
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
      rowClick (row) {
        this.watchDetails(row)
      },
      // 查看详情
      watchDetails (item) {
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
      // 编辑
      toEditor (row) {
        this.xqId = row.id
        this.showbian = true
      },
      handleSizeChange (val) {
        this.searchInfo.limit = val
        this.getList()
      },
      handleCurrentChange (current) {
        this.searchInfo.current = current
        this.getList()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  $fontFamily: "SimHei";
  $fontFamilys: "Microsoft YaHei";
  $font: "SimSun";
  $ST: '宋体';
  .wraper-yOutlet{
    width: 100%;
    height: 100%;
    background: #f8f8f8;
    padding: 16px;
    position: relative;
    .panel-warp {
      border-radius: 6px;
    }
    .w-footer{
      width: 100%;
      text-align: right;
      padding: 0 10px 0;
      background: white;
      height: 60px;
      position: relative;
      left: 0;
      bottom: 1px;
      .line{
        display: block;
        width: 100%;
        height: 1px;
        background: #dadbdc;
        margin-bottom: 16px;
      }
    }
    .searchhead{
      padding: 1px 16px;
      overflow: hidden;
      min-width: 980px;
      .button-wrap{
        float: right;
        margin-right: 30px;
        margin-top: 16px;
        .icon-wrap{
          display: inline-block;
          margin-left: 3px;
          color: #1c8ffa;
          font-size: 12px;
          cursor: pointer;
        }
      }
      .search-item{
        display: inline-block;
        margin-right: 20px;
        margin-top: 16px;
        &>span{
          &:first-child{
            width: 48px;
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
    .searchheadA{
      width: 100%;
      position: absolute;
      left: 0;
      top: 50px;
      z-index: 1000;
      background: white;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
    }
    .table-wrap{
      min-width: 980px;
      padding: 16px;
      .statecla{
        font-size: 12px;
        font-family: '宋体';
      }
      .isred{
        color: red;
      }
    }
  }
  .editor-wrap-enter-active {
    transition: all 0.5s ease;
  }
  .editor-wrap-leave-active {
    transition: all 0.5s ease;
  }
  .editor-wrap-enter, .editor-wrap-leave-to {
    transform: translateX(560px);
  }
</style>
