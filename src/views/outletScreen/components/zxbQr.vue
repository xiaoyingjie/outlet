<template>
  <div class="wraper-editor">
    <Panel warpWidth="100%" heightTab="calc(100% - 40px)">
      <div slot="title">
        <i class="icfont iconfont iconedit1"></i>
        专项办确认
      </div>
      <div slot="content">
        <div class="content-wraper">
          <div class="item-content">
            <div>
              <span class="isd">是否通过</span>
              <el-select size="small" clearable style="width: 240px" v-model="shInfo.checkstate" placeholder="请选择审核状态">
                <el-option
                  label="通过"
                  :value="1">
                </el-option>
                <el-option
                  label="不通过"
                  :value="0">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item-content">
            <div style="width: 100%">
              <span class="isd">描述</span>
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                v-model="shInfo.checkremark">
              </el-input>
            </div>
          </div>
          <div class="item-content" style="margin-top: 20px;text-align: center">
            <el-button size="small" type="primary" @click="confirm">确认</el-button>
            <el-button size="small" type="info" @click="$emit('goback')">取消</el-button>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<script>
  import Panel from '@/components/Panel'
  import * as api from '@/store/api'

  export default {
    props: ['userRow'],
    components: {
      Panel
    },
    data () {
      return {
        shInfo: {
          checkremark: '',
          checkstate: ''
        }
      }
    },
    methods: {
      confirm () {
        if (this.userRow.checkstate3 <= 0) {
          this.$message({
            message: '地方未填报或填报未通过，无法进行审核操作',
            type: 'warning'
          })
          return
        }
        if (!this.shInfo.checkstate) {
          this.$message({
            message: '您还没有选择是否通过',
            type: 'warning'
          })
          return
        }
        let args = {
          checkerid: JSON.parse(window.localStorage.getItem('userDetail')).userId,
          wtid: this.userRow.id,
          dfqrid: this.userRow.dfqrid
        }
        api.auditInsertMinistryConfirmA(Object.assign({}, args, this.shInfo)).then(res => {
          if (res.status === 200 && res.data.c === 1) {
            this.$message({
              message: '审核成功',
              type: 'success'
            })
            this.$emit('goback', 1)
            return
          }
          this.$message({message: '审核失败', type: 'warning', duration: 1000})
        }).catch(error => {
          console.log(error)
          this.$message({message: '审核失败', type: 'warning', duration: 1000})
        })
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
    .content-wraper{
      width: 560px;
      height: 100%;
      padding: 4px 28px;
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
