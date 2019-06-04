<template>
  <div class="uplode-wraper" v-loading="loading">
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      name="image"
      multiple
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <i class="icfont iconfont iconmorentupian avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
  import * as api from '@/store/api'
  export default {
    props: ['imagetype'],
    components: {
    },
    data () {
      return {
        uploadUrl: api.uploadImgUrl,
        loading: false
      }
    },
    created () {
    },
    methods: {
      handleAvatarSuccess (res, file) {
        let item = {
          imagename: res.imagename,
          imageurl: res.imageurl,
          imagetype: this.imagetype
        }
        this.loading = false
        this.$emit('finished', item)
      },
      beforeAvatarUpload (file) {
        this.loading = true
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传图片只能是JPG和PNG格式!')
          this.loading = false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
          this.loading = false
        }
        return isJPG && isLt2M
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
  .el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
    width: 100%;
    height: 100%;
    line-height: 72px;
    font-size: 68px;
  }
  .uplode-wraper{
    width: 100%;
    height: 100%;
    .avatar-uploader{
      width: 100%;
      height: 100%;
      text-align: center;
      .avatar-uploader-icon {
        font-size: 68px;
        // color: #8c939d;
        width: 160px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .icfont {
        color: #1c8ffa;
      }
    }
  }
</style>
