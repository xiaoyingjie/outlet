<template>
  <div>
    <Panel :warpWidth="'100%'" heightTab="calc(100% - 40px)" v-loading="loading">
      <div slot="title">
        <i class="icfont iconfont icon-xiangqing1"></i>
        现场排查详情
      </div>
      <div slot="content">
        <div class="wraper-comtent">
          <div class="content-item">
            <div>
              <span class="isd">排污口名称</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.pwkName"></el-input>
            </div>
            <div>
              <span class="isd">是否是排污口</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.sfspwkstr"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">行政区划</span>
              <el-cascader
                size="small"
                disabled
                :options="options"
                change-on-select
                clearable
                :props="xzqhprops"
                v-model="selectXzqh"
                style="width: 300px"
                filterable>
              </el-cascader>
            </div>
            <div>
              <span class="isd">详细地址</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.address"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">经度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.ptxstr"></el-input>
            </div>
            <div>
              <span class="isd">纬度</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.ptystr"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">排查阶段</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.checklevel"></el-input>
            </div>
            <div>
              <span class="isd">排放状况</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.pfzkname"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">入海方式</span>
              <el-cascader
                size="small"
                :disabled="readonly"
                placeholder="请选择入海方式"
                :options="rhkoptions"
                change-on-select
                clearable
                style="width: 300px"
                :props="rhkprops"
                v-model="selectRhk"
                :show-all-levels="false"
                filterable>
              </el-cascader>
            </div>
            <div>
              <span class="isd">填表人单位</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.createrJobUnit"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">填表时间</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.createtime"></el-input>
            </div>
            <div>
              <span class="isd">填表人</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.createrName"></el-input>
            </div>
          </div>
          <div class="content-item">
            <div>
              <span class="isd">有无关联疑似排口</span>
              <el-input size="small" :readonly="readonly" style="width: 300px" v-model="rhzpkInfo.sewagestate"></el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>排污口类型</span>
          </div>
          <div class="wraper-indentation">
            <el-radio-group :disabled="readonly" v-model="rhzpkInfo.pwklx">
              <el-radio v-for="(item, index) in pwkOptions" :key="index" :label="item.code">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
          <div class="item-content" v-if="rhzpkInfo.pwklx === '0406'">
            <div style="width: 100%">
              <span class="isd">排污口类型描述</span>
              <el-input
                type="textarea"
                :rows="3"
                :readonly="readonly"
                placeholder="请输入内容"
                v-model="rhzpkInfo.pwklxms">
              </el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>排污口周边环境</span>
          </div>
          <div class="wraper-indentation have-bottom">
            <el-checkbox-group :disabled="readonly" v-model="zbhjChecked">
              <el-checkbox v-for="(item, index) in zbhjOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="item-content" v-if="zbhjChecked.some(el => el === '0107')">
            <div style="width: 100%">
              <span class="isd">排污口周边环境补充描述</span>
              <el-input
                type="textarea"
                :rows="3"
                :readonly="readonly"
                placeholder="请输入内容"
                v-model="rhzpkInfo.pwkzbhjremark">
              </el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>污水疑似来源</span>
          </div>
          <div class="wraper-indentation have-bottom">
            <el-checkbox-group :disabled="readonly" v-model="wsyslyChecked">
              <el-checkbox v-for="(item, index) in wsyslyOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="item-content" v-if="wsyslyChecked.some(el => el === '0510')">
            <div style="width: 100%">
              <span class="isd">污水疑似来源补充描述</span>
              <el-input
                type="textarea"
                :rows="3"
                :readonly="readonly"
                placeholder="请输入内容"
                v-model="rhzpkInfo.wsyslyqt">
              </el-input>
            </div>
          </div>
          <!-- <div class="wraper-indentation have-bottom">
            <div class="check-title">农业农村污水</div>
            <el-checkbox-group v-model="checked">
              <el-checkbox v-for="(item, index) in chackList" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div> -->
          <div class="item-title">
            <span></span>
            <span>采样监测</span>
          </div>
          <div class="wraper-indentation have-bottom">
            <el-radio-group :disabled="readonly" v-model="rhzpkInfo.sfjbcytj">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div class="wraper-indentation have-bottom" v-if="rhzpkInfo.sfjbcytj">
            <span style="margin-right: 50px">COD:{{ rhzpkInfo.cod }}mg/d</span>
            <span style="margin-right: 50px">氨氮:{{ rhzpkInfo.andan }}mg/l</span>
            <span style="margin-right: 50px">总磷:{{ rhzpkInfo.zonglin }}mg/l</span>
            <span style="margin-right: 50px">PH:{{ rhzpkInfo.ph }}</span>
            <span style="margin-right: 50px">流量:{{ rhzpkInfo.liuliang }}m3/d</span>
          </div>
          <div class="wraper-indentation" v-if="rhzpkInfo.sfjbcytj">
            <span style="display: inline-block;width: 60px;vertical-align: top;">情况描述：</span>
            <span style="display: inline-block;width: calc(100% - 70px)">{{ rhzpkInfo.ycxcyms }}</span>
          </div>
          <div class="item-title">
            <span></span>
            <span>备注信息</span>
          </div>
          <div class="wraper-indentation">
            <span>{{ rhzpkInfo.remark }}</span>
          </div>
          <div class="item-title">
            <span></span>
            <span>排污口照片</span>
          </div>
          <div class="picture-content">
            <div class="picturetitle">基本形态特征</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0601'">
                  <img :src="item.imageurl" preview="1">
                </div>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">水的来源向</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0602'">
                  <img :src="item.imageurl" preview="2">
                </div>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">水的去向</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0603'">
                  <img :src="item.imageurl" preview="3">
                </div>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">周边环境特征</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0604'">
                  <img :src="item.imageurl" preview="4">
                </div>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">典型建筑物</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0605'">
                  <img :src="item.imageurl" preview="5">
                </div>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">现场情况</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0606'">
                  <img :src="item.imageurl" preview="6">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import * as api from '@/store/api'
  import Panel from '@/components/Panel'
  import { getXzqhA, dealXzqu } from '@/mk'
  export default {
    components: {
      Panel
    },
    data () {
      return {
        value: '',
        readonly: true,
        loading: false,
        imageList: [],
        pwkOptions: [],
        zbhjOptions: [],
        rhkoptions: [],
        wsyslyOptions: [],
        zbhjChecked: [],
        wsyslyChecked: [],
        rhzpkInfo: {},
        selectRhk: [],
        rhkprops: {
          value: 'code',
          label: 'name',
          children: 'enumChilds'
        },
        xzqhprops: {
          value: 'c',
          label: 'n',
          children: 'nodes'
        },
        options: [],
        selectXzqh: []
      }
    },
    computed: {
    },
    created () {
      this.options = getXzqhA()
      this.editorDetails()
      this.getTypepwk('pwkOptions', '04')
      this.getTypepwk('rhkoptions', '08')
    },
    activated () {
      this.editorDetails()
    },
    methods: {
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
      // 详情
      editorDetails () {
        this.loading = true
        let id
        let rowdata = JSON.parse(sessionStorage.getItem('detailObj')).rowData
        let type = JSON.parse(sessionStorage.getItem('detailObj')).type
        if (type === 'yspk') {
          id = rowdata.pcid
        } else if (type === 'xcpc') {
          id = rowdata.id
        }
        api.rhpwkGetDetailA(id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.detailsdata = res.data.r
            this.dealInformation(res.data.r)
            this.loading = false
            return
          }
          this.loading = false
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      dealInformation (data) {
        this.rhzpkInfo = data.rhzpkInfo
        this.zbhjOptions = data.pwkzbhj
        this.selectXzqh = dealXzqu(data.rhzpkInfo.xzqh)
        let zbhjcheckedItem = this.zbhjOptions.filter(el => el.checked === true)
        this.zbhjChecked = zbhjcheckedItem.map(el => el.code)
        this.wsyslyOptions = data.wsysly
        let wsyslyCheckItem = this.wsyslyOptions.filter(el => el.checked === true)
        this.wsyslyChecked = wsyslyCheckItem.map(el => el.code)
        this.imageList = data.checkImageList || []
        this.selectRhk = [data.rhzpkInfo.pffsyj]
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .isd{
    display: block;
    margin-bottom: 10px;
  }
  .el-checkbox {
    width: 140px;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0;
  }
  .el-radio {
    margin-bottom: 5px;
    width: 140px;
  }
  .el-radio+.el-radio {
    margin-left: 0;
  }
  @import './css/common.scss'
</style>
