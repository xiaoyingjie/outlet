<template>
  <div class="wraper-editor" v-loading="loading">
    <Panel warpWidth="100%" heightTab="calc(100% - 100px)">
      <div slot="title">
        <i class="icfont iconfont iconedit1"></i>
        地方意见
        <div class="handle-button" style="float:right">
          <el-button type="text" size="small" @click="$emit('goback', 1)" v-show="!showDetails">返回</el-button>
        </div>
        <div class="handle-button" style="float:right;margin-right: 10px">
          <el-button type="text" size="small" @click="toAdd" v-show="!showDetails">添加</el-button>
        </div>
      </div>
      <div slot="content">
        <div class="dfyjTable" v-if="!showDetails">
          <div class="table-wraper">
            <el-table
              :data="listData"
              :row-style="rowStyle"
              @row-click="rowClick"
              style="width: 100%">
              <el-table-column
                type="index"
                width="50">
              </el-table-column>
              <el-table-column
                prop="creatername"
                label="创建人">
              </el-table-column>
              <el-table-column
                prop="createtime"
                label="创建时间">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="editor-content" v-if="showDetails" v-loading="loading1">
          <div class="item-title">
            <span></span>
            <span>河(湖)长制</span>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">排污口所属河湖名称</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.hhmc"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">二级(市级)总河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.ejzhzmc"></el-input>
            </div>
            <div>
              <span class="isd">二级(市级)河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.ejhzmc"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">三级(县级)总河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.sanjzhzmc"></el-input>
            </div>
            <div>
              <span class="isd">三级(县级)河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.sanjhzmc"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">四级(乡级)总河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.sijzhzmc"></el-input>
            </div>
            <div>
              <span class="isd">四级(乡级)河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.sijhzmc"></el-input>
            </div>
          </div>
          <div class="item-content">
            <div>
              <span class="isd">五级(村级)河(湖)长</span>
              <el-input :readonly="!isAdd" size="small" style="width: 240px" v-model="detailsData.wjhzmc"></el-input>
            </div>
          </div>
          <div class="item-title">
            <span></span>
            <span>申诉内容</span>
          </div>
          <div class="shensu-wraper">
            <div class="shensu-content" v-for="(item, index) in AddAuditList" :key="index">
              <div class="item-content" style="margin-bottom: 10px">
                <div style="width: 100%">
                  <span class="isd">申诉内容详细描述（{{ index + 1 }}）</span>
                  <el-input
                    type="textarea"
                    :rows="3"
                    :readonly="!isAdd"
                    placeholder="请输入申诉内容"
                    v-model="item.dfssyj">
                  </el-input>
                </div>
              </div>
              <div class="picture-content">
                <div class="picturetitle">反应排污口、现场及周边环境的照片</div>
                <div style="margin-left: 10px" class="picturetitle" v-if="!isAdd && !item.checkImageList || item.checkImageList.length === 0 && !isAdd">暂无照片</div>
                <div class="picture-wrap" v-if="item.checkImageList">
                  <div style="display: inline" v-for="(it, i) in item.checkImageList" :key="i">
                    <div class="picture-item">
                      <img :src="it.imageurl" :preview="index">
                    </div>
                  </div>
                  <div class="picture-item updatewraper" v-if="isAdd">
                    <uploadImg :index="index" @finished="uploadFinish"></uploadImg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="addbutton" @click="addYjMs" v-if="isAdd">
            <div><i class="el-icon-plus"></i></div>
          </div>
          <div class="item-title">
            <span></span>
            <span>备注</span>
          </div>
          <div class="item-content">
            <div style="width: 100%">
              <span class="isd">备注信息</span>
              <el-input
                type="textarea"
                :rows="3"
                :readonly="!isAdd"
                placeholder="请输入备注信息"
                v-model="detailsData.bz">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <div class="content-button">
          <el-button size="small" style="width: 132px" type="primary" @click="showDetails = false" v-if="!isAdd && showDetails">返回</el-button>
          <el-button size="small" type="primary" @click="addDfyj" v-if="isAdd">确认</el-button>
          <el-button size="small" type="info" @click="showDetails = false;isAdd = false" v-if="isAdd">取消</el-button>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import uploadImg from '@/components/uplodImg'
  import * as api from '@/store/api'

  export default {
    props: ['userRow'],
    components: {
      Panel,
      uploadImg
    },
    data () {
      return {
        listData: [],
        showDetails: false,
        detailId: '',
        rowStyle: {
          cursor: 'pointer'
        },
        AddAuditList: [],
        loading: false,
        loading1: false,
        isAdd: false,
        // ---
        detailsData: {}
        // 是编辑还是添加
      }
    },
    created () {
      this.getList()
    },
    methods: {
      addDfyj () {
        let ms = []
        this.AddAuditList.map(el => {
          let item = {
            dfssyj: el.dfssyj,
            images: el.checkImageList
          }
          ms.push(item)
        })
        let args = {
          createrid: JSON.parse(window.localStorage.getItem('userDetail')).userId,
          wtid: this.userRow.id,
          bz: this.detailsData.bz,
          hhmc: this.detailsData.hhmc,
          ejzhzmc: this.detailsData.ejzhzmc,
          ejhzmc: this.detailsData.ejhzmc,
          sanjzhzmc: this.detailsData.sanjzhzmc,
          sanjhzmc: this.detailsData.sanjhzmc,
          sijzhzmc: this.detailsData.sijzhzmc,
          sijhzmc: this.detailsData.sijhzmc,
          wjhzmc: this.detailsData.wjhzmc,
          appealAddRequests: ms
        }
        // auditInsertLocalAuditA
        this.loading1 = true
        api.auditInsertLocalAuditA(args).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.loading1 = false
            this.isAdd = false
            this.showDetails = false
            this.getList()
            return
          }
          this.loading1 = false
          this.$message({message: '添加失败', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '添加失败', type: 'warning', duration: 1000})
        })
        console.log(args)
      },
      toAdd () {
        this.isAdd = true
        this.showDetails = true
        this.detailsData = {}
        this.AddAuditList = []
      },
      addYjMs () {
        let ietm = {
          dfssyj: '',
          checkImageList: []
        }
        this.AddAuditList.push(ietm)
      },
      uploadFinish (item, index) {
        this.AddAuditList[index].checkImageList.push(item)
        this.$previewRefresh()
      },
      getList () {
        this.loading = true
        api.auditGetLocalAuditListA(this.userRow.id).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.listData = res.data.r.data
            this.loading = false
            return
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      getDetails () {
        this.loading1 = true
        api.auditGetLocalAuditDetailA(this.detailId).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.detailsData = res.data.r
            this.AddAuditList = res.data.r.appealAuditList || []
            this.loading1 = false
            return
          }
          this.loading1 = false
        }).catch(error => {
          console.log(error)
          this.$message({message: '查询异常', type: 'warning', duration: 1000})
        })
      },
      rowClick (row) {
        this.showDetails = true
        this.detailId = row.id
        this.getDetails()
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
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
    .dfyjTable{
      width: 560px;
      height: 100%;
      padding: 4px 28px;
      position: relative;
    }
    .editor-content{
      width: 560px;
      height: 100%;
      padding: 4px 28px;
      position: relative;
      .addbutton{
        position: relative;
        height: 44px;
        &>div{
          cursor: pointer;
          width: 330px;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 44px;
          font-size: 28px;
          border-radius: 5px;
          text-align: center;
          line-height: 44px;
          border: 1px solid #ddd;
          &:hover{
            color: #409EFF;
            border: 1px solid #409EFF;
          }
        }
      }
      .shensu-wraper{
        margin-bottom: 20px;
        .shensu-content{
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
      .item-title{
        padding-bottom: 10px;
        font-size: 12PX;
        margin-top: 20px;
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
    }
  }
</style>
