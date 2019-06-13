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
              style="width: 180px"
              :props="xzqhprops"
              v-model="selectXzqh"
              :show-all-levels="false"
              filterable>
            </el-cascader>
          </div>
          <div class="search-item">
            <span>是否是排污口</span>
            <el-select clearable size="small" style="width: 180px"  v-model="searchInfo.sfspwk" placeholder="请选择是否是排污口">
              <el-option
                label="是"
                value="1">
              </el-option>
              <el-option
                label="否"
                value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>排污口名称</span>
            <el-input size="small" style="width: 180px" v-model="searchInfo.pwkName" placeholder="请输入排污口名称"></el-input>
          </div>
          <div class="button-wrap">
            <el-button type="primary" size="small" @click="onSearch">查询</el-button>
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
            <span>排放状况</span>
            <el-select size="small" style="width: 180px"  v-model="searchInfo.pfzk" placeholder="请选择类型" clearable>
              <el-option
                v-for="(item, index) in pfzkOptions"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>状态</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.sewagestate" placeholder="请选择">
              <el-option
                label="已确认排口"
                value="1">
              </el-option>
              <el-option
                label="未确认排口"
                value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>异常需采样</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.ycxcy" placeholder="请选择">
              <el-option
                label="需要"
                value="1">
              </el-option>
              <el-option
                label="不需要"
                value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>排污口类型</span>
            <el-select clearable size="small" style="width: 180px"  v-model="searchInfo.pwklx" placeholder="请选择类型" clearable>
              <el-option
                v-for="(item, index) in pwkOptions"
                :key="index"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span>入海方式</span>
            <el-cascader
              size="small"
              placeholder="请选择入海方式"
              :options="rhkoptions"
              change-on-select
              clearable
              style="width: 180px"
              :props="rhkprops"
              v-model="selectRhk"
              :show-all-levels="false"
              filterable>
            </el-cascader>
          </div>
          <div class="search-item">
            <span>是否采样</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.sfjbcytj" placeholder="请选择">
              <el-option
                label="是"
                value="1">
              </el-option>
              <el-option
                label="否"
                value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span style="vertical-align: bottom;">是否填报专项办意见</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.sftbzxbyj" placeholder="请选择">
              <el-option
                label="是"
                :value="1">
              </el-option>
              <el-option
                label="否"
                :value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span style="vertical-align: bottom;">是否填报地方意见</span>
            <el-select size="small" style="width: 180px" v-model="searchInfo.sftbdfyj" placeholder="请选择">
              <el-option
                label="是"
                :value="1">
              </el-option>
              <el-option
                label="否"
                :value="0">
              </el-option>
            </el-select>
          </div>
          <div class="search-item">
            <span style="vertical-align: bottom;">是否反馈地方意见</span>
            <el-select clearable size="small" style="width: 180px" v-model="searchInfo.sffkyj" placeholder="请选择">
              <el-option
                label="是"
                :value="1">
              </el-option>
              <el-option
                label="否"
                :value="0">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="table-wrap">
          <el-table
            :data="tableData"
            :row-style="rowStyle"
            @row-click="rowClick">
            <el-table-column
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              width="160"
              label="操作">
              <template slot-scope="scope">
                <el-popover
                  v-if="permissions.some(el => el.name === 'leader')"
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">组长审核</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'zzsh')" type="text"><i class="icfont iconfont iconshenheshenpi"></i></el-button>
                </el-popover>
                <el-popover
                  v-if="permissions.some(el => el.name === 'leader')"
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">专项办审核</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'zxbsh')" type="text"><i class="icfont iconfont iconyijianfankui"></i></el-button>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">专项办确认</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'zxbqr')" type="text"><i class="icfont iconfont iconzhuanxiangbanqueren"></i></el-button>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">编辑排查详情</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'bianji')" type="text"><i class="icfont iconfont icontongjibaobiao"></i></el-button>
                </el-popover>
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">添加地方意见</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'dfyj')" type="text"><i class="icfont iconfont iconedit1"></i></el-button>
                </el-popover>
                <!-- <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">查看详情</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="watchDetails(scope.row)" type="text"><i class="icfont iconfont iconzhuanxiangbanqueren"></i></el-button>
                </el-popover> -->
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">添加监测信息</div>
                  <el-button slot="reference" style="font-size: 12px;" @click.stop="toEditor(scope.row, 'jiance')" type="text"><i class="icfont iconfont iconpaiwukoujiance"></i></el-button>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              label="状态">
              <template slot-scope="scope">
                <div class="statecla" :class="[ scope.row.sewagestate === '未确认排口' ? 'isred' : '' ]">{{ scope.row.sewagestate }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="sftbzxbyj"
              label="是否填报专项办意见">
            </el-table-column>
            <el-table-column
              prop="sftbdfyj"
              label="是否填报地方意见">
            </el-table-column>
            <el-table-column
              prop="sffkyj"
              label="是否反馈地方意见">
            </el-table-column>
            <el-table-column
              width="84"
              label="所在地">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">{{ scope.row.address }}</div>
                  <div class="shenlue" slot="reference">
                    {{ scope.row.address }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="sfspwk"
              label="是否是排污口">
            </el-table-column>
            <el-table-column
              prop="pwkName"
              label="排污口名称">
            </el-table-column>
            <el-table-column
              prop="pfzkname"
              label="排放状况">
            </el-table-column>
            <el-table-column
              width="84"
              label="入海方式">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  trigger="hover">
                  <div style="text-align: center;font-size: 12px;" class="poverc">{{ scope.row.rhfs }}</div>
                  <div class="shenlue" slot="reference">
                    {{ scope.row.rhfs }}
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="pwklxname"
              label="排污口类型">
            </el-table-column>
            <el-table-column
              prop="ycxcy"
              label="异常需采样">
            </el-table-column>
            <el-table-column
              prop="sfjbcytj"
              label="是否采样">
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
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </Panel>
    <transition name="editor-wrap">
      <editorP v-if="showname === 'bianji'" @goback="goback" :pwkOptions="pwkOptions" :rhkoptions="rhkoptions" :pfzkOptions="pfzkOptions" :userRow="userRow"></editorP>
      <add-jiance v-if="showname === 'jiance'" :userRow="userRow" @goback="goback"></add-jiance>
      <add-dfyj v-if="showname === 'dfyj'" @goback="goback" :userRow="userRow"></add-dfyj>
      <group-leader @goback="goback" v-if="showname === 'zzsh'" :userRow="userRow"></group-leader>
      <zxb-shenhe v-if="showname === 'zxbsh'" @goback="goback" :userRow="userRow"></zxb-shenhe>
      <zxb-qr v-if="showname === 'zxbqr'" @goback="goback" :userRow="userRow"></zxb-qr>
    </transition>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import editorP from './components/editorPoutlet'
  import addJiance from './components/addJiance'
  import addDfyj from './components/addDfyj'
  import groupLeader from './components/groupLeader'
  import zxbShenhe from './components/zxbShenhe'
  import zxbQr from './components/zxbQr'
  import * as api from '@/store/api'
  import { getXzqhA } from '@/mk'

  export default {
    components: {
      Panel,
      editorP,
      addJiance,
      addDfyj,
      groupLeader,
      zxbShenhe,
      zxbQr
    },
    data () {
      return {
        zhankaiState: true,
        showname: '',
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        rhkprops: {
          value: 'code',
          label: 'name',
          children: 'enumChilds'
        },
        rowStyle: {
          cursor: 'pointer'
        },
        pwkOptions: [],
        pfzkOptions: [],
        rhkoptions: [],
        loading: false,
        searchInfo: {
          pwkName: '',
          pwklx: '',
          sfjbcytj: '',
          sewagestate: '',
          sfspwk: '',
          pfzk: '',
          ycxcy: '',
          pffsyj: '',
          pffsej: '',
          limit: 5,
          current: 1
        },
        total: 0,
        selectXzqh: [],
        selectRhk: [],
        options: [],
        tableData: [],
        userRow: {},
        // 排查权限数据
        permissions: ''
      }
    },
    created () {
      this.getTypepwk('pwkOptions', '04')
      this.getTypepwk('pfzkOptions', '03')
      this.getFsRh('rhkoptions', '08')
      this.options = getXzqhA()
      this.getList()
      let menu = JSON.parse(localStorage.getItem('menu'))
      let permissionsParent = menu.find(el => el.mkname === '排污口排查')
      this.permissions = permissionsParent.children.find(el => el.mkname === '现场排查').oitems
    },
    methods: {
      onSearch () {
        this.getList()
      },
      getList () {
        this.loading = true
        this.searchInfo.xzqh = this.selectXzqh[this.selectXzqh.length - 1] || ''
        this.searchInfo.pffsyj = this.selectRhk[0] || ''
        this.searchInfo.pffsej = this.selectRhk[1] || ''
        api.rhpwkGetPageListA(this.searchInfo).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.total = res.data.r.total
            this.tableData = res.data.r.data
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
      // 枚举数据
      getTypepwk (target, code) {
        api.rhpwkGetEnumA(code).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this[target] = res.data.r
            return
          }
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      // 入海方式获取
      getFsRh (target, code) {
        api.rhpwkGetNextEnumA(code).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this[target] = res.data.r.enumList
            return
          }
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      rowClick (row) {
        this.watchDetails(row)
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
      },
      goback (val) {
        this.showname = ''
        if (val === 1) {
          this.getList()
        }
      },
      // caozuo 操作
      toEditor (row, state) {
        this.userRow = row
        this.showname = state
      },
      handleSizeChange (val) {
        this.searchInfo.limit = val
        this.getList()
      },
      handleCurrentChange (val) {
        this.searchInfo.current = val
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
    .poverc{
      
    }
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
      min-width: 1030px;
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
            width: 72px;
            display: inline-block;
            margin-right: 8px;
          }
        }
      }
    }
    .searchheadA{
      position: absolute;
      left: 0;
      top: 50px;
      z-index: 1000;
      background: white;
      border-bottom: 1px solid #ddd;
      padding-bottom: 20px;
    }
    .table-wrap{
      // min-width: 1030px;
      padding: 16px;
      .statecla{
        font-size: 12px;
        font-family: '宋体';
      }
      .isred{
        color: red;
      }
      .shenlue{
        cursor: pointer;
        width: 7em;
        font-size: 12px;
        font-family: '宋体';
        overflow: hidden; /*自动隐藏文字*/
        text-overflow: ellipsis;/*文字隐藏后添加省略号*/
        white-space: nowrap;/*强制不换行*/
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
