<template>
  <div class="wraper-editor" v-loading="loading">
    <Panel warpWidth="100%" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont iconedit1"></i>
        编辑页
      </div>
      <div slot="content">
        <div class="editor-content">
          <div class="item-content">
            <div>
              <span class="isd">排污口名称</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.pwkName"></el-input>
            </div>
            <div>
              <span class="isd">是否是排污口</span>
              <el-select size="small" style="width: 240px" v-model="rhzpkInfo.sfspwk" placeholder="请选择">
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
          <div class="item-content">
            <div>
              <span class="isd">行政区划</span>
              <el-cascader
                size="small"
                :options="options"
                change-on-select
                clearable
                :props="xzqhprops"
                v-model="selectXzqh"
                :show-all-levels="false"
                style="width: 240px"
                filterable>
              </el-cascader>
            </div>
            <div>
              <span class="isd">详细地址</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.address"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">经度</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.ptxstr"></el-input>
            </div>
            <div>
              <span class="isd">纬度</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.ptystr"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">排查阶段</span>
              <!-- checklevel -->
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.checklevel"></el-input>
            </div>
            <div>
              <span class="isd">排放状况</span>
              <el-select size="small" style="width: 240px"  v-model="rhzpkInfo.pfzk" placeholder="请选择类型" clearable>
                <el-option
                  v-for="(item, index) in pfzkOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item-content" v-if="rhzpkInfo.pfzk === '0304'">
            <div style="width: 100%">
              <span class="isd">排放状况描述</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="rhzpkInfo.pfzkms">
              </el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">入海方式</span>
              <el-cascader
                size="small"
                placeholder="请选择入海方式"
                :options="rhkoptions"
                change-on-select
                clearable
                style="width: 240px"
                :props="rhkprops"
                v-model="selectRhk"
                :show-all-levels="false"
                filterable>
              </el-cascader>
            </div>
            <div>
              <span class="isd">填表人单位</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.createrJobUnit"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">填表时间</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.createtime "></el-input>
            </div>
            <div>
              <span class="isd">填表人</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.createrName"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">有无关联疑似排口</span>
              <el-input size="small" readonly style="width: 240px" v-model="rhzpkInfo.sewagestate"></el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>排污口类型</span>
          </div>
          <div class="wraper-indentation">
            <el-radio-group v-model="rhzpkInfo.pwklx">
              <el-radio v-for="(item, index) in pwkOptions" :key="index" :label="item.code">{{ item.name }}</el-radio>
            </el-radio-group>
          </div>
          <div class="item-content" v-if="rhzpkInfo.pwklx === '0406'">
            <div style="width: 100%">
              <span class="isd">排污口类型描述</span>
              <el-input
                type="textarea"
                :rows="3"
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
            <el-checkbox-group v-model="zbhjChecked">
              <el-checkbox v-for="(item, index) in zbhjOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="item-content" v-if="zbhjChecked.some(el => el === '0107')">
            <div style="width: 100%">
              <span class="isd">排污口周边环境补充描述</span>
              <el-input
                type="textarea"
                :rows="3"
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
            <el-checkbox-group v-model="wsyslyChecked">
              <el-checkbox v-for="(item, index) in wsyslyOptions" :key="index" :label="item.code">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="item-content" v-if="wsyslyChecked.some(el => el === '0510')">
            <div style="width: 100%">
              <span class="isd">污水疑似来源补充描述</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="rhzpkInfo.wsyslyqt">
              </el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>快速检测</span>
          </div>
          <div style="margin-bottom: 10px;">是否具备采样条件</div>
          <div class="wraper-indentation">
            <el-radio-group v-model="rhzpkInfo.sfjbcytj">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
          <div class="item-content" v-if="rhzpkInfo.sfjbcytj">
            <div>
              <span class="isd">COD(mg/d)</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.cod"></el-input>
            </div>
            <div>
              <span class="isd">氨氮(mg/L)</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.andan"></el-input>
            </div>
          </div>
          <div class="item-content" v-if="rhzpkInfo.sfjbcytj">
            <div>
              <span class="isd">总磷(mg/L)</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.zonglin"></el-input>
            </div>
            <div>
              <span class="isd">PH</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.ph"></el-input>
            </div>
          </div>
          <div class="item-content" v-if="rhzpkInfo.sfjbcytj">
            <div>
              <span class="isd">流量(m3/d)</span>
              <el-input size="small" style="width: 240px" v-model="rhzpkInfo.liuliang"></el-input>
            </div>
          </div>
          <div class="item-content" v-if="rhzpkInfo.sfjbcytj">
            <div>
              <span class="isd">异常需采样</span>
              <el-select size="small" style="width: 240px" v-model="rhzpkInfo.ycxcy" placeholder="请选择">
                <el-option
                  label="需要"
                  :value="1">
                </el-option>
                <el-option
                  label="不需要"
                  :value="0">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item-content" v-if="rhzpkInfo.sfjbcytj">
            <div style="width: 100%">
              <span class="isd">描述</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="rhzpkInfo.ycxcyms">
              </el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>备注信息</span>
          </div>
          <div class="item-content">
            <div style="width: 100%">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="rhzpkInfo.remark">
              </el-input>
            </div>
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
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="1">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0601" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">水的来源向</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0602'">
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="2">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0602" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">水的去向</div>
            <div class="picture-wrap">
              <div style="display: inline"  v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0603'">
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="3">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0603" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">周边环境特征</div>
            <div class="picture-wrap">
              <div style="display: inline" v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0604'">
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="4">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0604" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">典型建筑物</div>
            <div class="picture-wrap">
              <div style="display: inline" v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0605'">
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="5">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0605" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
          <div class="picture-content">
            <div class="picturetitle">现场情况</div>
            <div class="picture-wrap">
              <div style="display: inline" v-for="(item, index) in imageList" :key="index">
                <div class="picture-item" v-if="item.imagetype === '0606'">
                  <div class="delet-content" @click="deleteImg(item.imageurl)"><i class="iconfont icontupianshanchu"></i></div>
                  <img :src="item.imageurl" preview="6">
                </div>
              </div>
              <div class="picture-item updatewraper">
                <uploadImg imagetype="0606" @finished="uploadFinish"></uploadImg>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="content-button">
          <el-button size="small" type="primary" @click="updateDetails">确认</el-button>
          <el-button size="small" type="info" @click="$emit('goback')">取消</el-button>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import * as api from '@/store/api'
  import uploadImg from '@/components/uplodImg'
  import { getXzqhA, dealXzqu } from '@/mk'

  export default {
    props: ['userRow', 'pwkOptions', 'pfzkOptions', 'rhkoptions'],
    components: {
      Panel,
      uploadImg
    },
    data () {
      return {
        rhzpkInfo: {},
        zbhjOptions: [],
        wsyslyOptions: [],
        zbhjChecked: [],
        wsyslyChecked: [],
        selectRhk: [],
        imageList: [],
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
        selectXzqh: [],
        // -------------
        loading: false
      }
    },
    created () {
      this.editorDetails()
      this.options = getXzqhA()
    },
    methods: {
      editorDetails () {
        this.loading = true
        api.rhpwkGetDetailA(this.userRow.id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
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
        this.selectXzqh = dealXzqu(data.rhzpkInfo.xzqh)
        this.zbhjOptions = data.pwkzbhj
        let zbhjcheckedItem = this.zbhjOptions.filter(el => el.checked === true)
        this.zbhjChecked = zbhjcheckedItem.map(el => el.code)
        this.wsyslyOptions = data.wsysly
        let wsyslyCheckItem = this.wsyslyOptions.filter(el => el.checked === true)
        this.wsyslyChecked = wsyslyCheckItem.map(el => el.code)
        this.imageList = data.checkImageList || []
        if (data.rhzpkInfo.pffsej) {
          this.selectRhk = [data.rhzpkInfo.pffsyj, data.rhzpkInfo.pffsej]
          return
        }
        this.selectRhk = [data.rhzpkInfo.pffsyj]
      },
      updateDetails () {
        let zbhj = []
        let wsly = []
        this.zbhjChecked.forEach(element => {
          let item = {
            code: element,
            id: '',
            mapperid: ''
          }
          zbhj.push(item)
        })
        this.wsyslyChecked.forEach(el => {
          let item = {
            code: el,
            id: '',
            mapperid: ''
          }
          wsly.push(item)
        })
        //  标记
        let args = {
          id: this.userRow.id,
          name: this.rhzpkInfo.pwkName,
          address: this.rhzpkInfo.address,
          sfspwk: this.rhzpkInfo.sfspwk,
          pfzk: this.rhzpkInfo.pfzk,
          xzqh: this.selectXzqh[this.selectXzqh.length - 1] || '',
          pfzkms: this.rhzpkInfo.pfzkms,
          pffsyj: this.selectRhk[0] || '',
          pffsej: this.selectRhk[1] || '',
          pwkzbhj: zbhj,
          pwklx: this.rhzpkInfo.pwklx,
          pwklxms: this.rhzpkInfo.pwklxms,
          pwkzbhjremark: this.rhzpkInfo.pwkzbhjremark,
          wsysly: wsly,
          wsyslyqt: this.rhzpkInfo.wsyslyqt,
          sfjbcytj: this.rhzpkInfo.sfjbcytj,
          cod: this.rhzpkInfo.cod,
          andan: this.rhzpkInfo.andan,
          zonglin: this.rhzpkInfo.zonglin,
          ph: this.rhzpkInfo.ph,
          liuliang: this.rhzpkInfo.liuliang,
          ycxcy: this.rhzpkInfo.ycxcy,
          ycxcyms: this.rhzpkInfo.ycxcyms,
          remark: this.rhzpkInfo.remark,
          checkImageList: this.imageList
        }
        api.rhpwkUpdatePwkInfoA(args).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$emit('goback', 1)
            return
          }
          this.$message({message: '编辑失败', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      uploadFinish (item) {
        this.imageList.push(item)
        this.$previewRefresh()
      },
      deleteImg (url) {
        let index = this.imageList.findIndex(el => el.imageurl === url)
        this.imageList.splice(index, 1)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
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
  .wraper-editor{
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    width: 560px;
    height: 100%;
    z-index: 1000;
    .content-button{
      position: relative;
      background: white;
      left: 0;
      bottom: 2px;
      width: 560px;
      height: 32px;
      text-align: center;
    }
    .editor-content{
      width: 560px;
      height: 100%;
      padding: 4px 28px 20px;
      position: relative;
      .item-content{
        font-size: 12PX;
        overflow: hidden;
          &>div{
            float: left;
            width: calc(50% - 24px);
            margin-top: 12px;
            &:first-child{
            margin-right: 32px;
          }
        }
        div{
          .isd{
            display: block;
            margin-bottom: 10px;
          }
        }
      }
      .item-title{
        padding-bottom: 10px;
        font-size: 12PX;
        margin-top: 30px;
        margin-left: -12px;
        span{
          display: inline-block;
          color: #000;
          font-weight: bold;
          &:first-child{
            width: 4px;
            height: 12px;
            background: #208DF3;
            margin-right: 4px;
          }
        }
      }
      .wraper-indentation{
        padding: 0px 38px;
        font-size: 12px;
        .check-title{
          font-size: 12px;
          margin-bottom: 10px;
        }
      }
      .have-bottom{
        margin-bottom: 20px;
      }
      .picture-content{
        font-size: 12px;
        margin-bottom: 12px;
        .picture-wrap{
          .picture-item{
            margin-top: 10px;
            cursor: pointer;
            width: 160px;
            height: 100px;
            border: 1px solid #DDD;
            position: relative;
            display: inline-block;
            vertical-align: top;
            margin-right: 6px;
            &:hover{
              .delet-content{
                display: block;
              }
            }
            .delet-content{
              display: none;
              cursor: pointer;
              width: 18px;
              height: 18px;
              font-size: 18px;
              text-align: center;
              line-height: 18px;
              color: #1c8ffa;
              position: absolute;
              right: -9px;
              top: -9px;
            }
            img{
              width: 100%;
              height: 100%;
            }
          }
          .updatewraper{
            border: 1px dashed #ddd;
            &:hover{
              border: 1px dashed #1c8ffa;
            }
          }
        }
      }
    }
  }
</style>
