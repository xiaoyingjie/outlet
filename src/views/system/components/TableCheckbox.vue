<template>
  <div class="wrap">
    <el-row v-for="(item, index) in items" :key="index">
      <el-col :span="5" :style="getHeight(item,index)">
        <el-checkbox @change="CheckChange(item)" :label="item.mkname" v-model="item.check">{{ item.mkname }}</el-checkbox>
      </el-col>
      <!-- 无子级菜单 -->
      <el-col :span="3" v-for="(subitem, subindex) in item.oitems" :key="subindex" v-if="!item.items">
        <el-checkbox  :label="subitem.cname" v-model="subitem.check">{{subitem.cname}}</el-checkbox>
      </el-col>
      <!-- 有子级菜单 -->
      <el-col :span="19" v-if="item.items">
        <el-row v-for="(subitem, subindex) in item.items" :key="subindex" >
          <el-col :style="getHeight1(item,index)" :span="5">
            <el-checkbox @change="CheckChange(subitem)" :label="subitem.mkname" v-model="subitem.check">{{ subitem.mkname }}</el-checkbox>
          </el-col>
          <el-col :span="3" v-for="(subsubitem, subsubindex) in subitem.oitems" :key="subsubindex">
            <el-checkbox @change="CheckChange(subsubitem)" :label="subsubitem.cname" v-model="subsubitem.check">{{subsubitem.cname}}</el-checkbox>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      defaule () {
        return []
      }
    }
  },
  data () {
    return {
      miniDivHeight: 49
    }
  },
  methods: {
    getHeight (item, index) {
      let length = item.items ? item.items.length : 1
      var height = this.miniDivHeight
      return `background: #fff5e7;height:${length * height}px;line-height:${length * height - 28}px;`
    },
    getHeight1 (item, index) {
      if (item.oitems && item.oitems.length > 0) {
        return `background: #fff5e7;`
      }
    },
    CheckChange (item) {
      if (item.items && item.items.length > 0) {
        item.items.forEach(element => {
          element.check = item.check
          if (element.oitems && element.oitems.length > 0) {
            element.oitems.forEach(ele => {
              ele.check = item.check
            })
          }
        })
      }
      if (item.oitems && item.oitems.length > 0) {
        item.oitems.forEach(element => {
          element.check = item.check
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-row {
  margin-bottom: 0px; /*去除el-row之间的间距*/
  border: 1px solid #e6e6e6;
  margin: -1px -1px -1px -1px; /*解决相邻边框重叠问题就靠这行代码*/
  &:last-child {
    margin-bottom: 0px;
  }
}
</style>
