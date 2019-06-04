<template>
  <div class="wraper">
    <el-tree
      :data="data4"
      :props="defaultProps"
      node-key="id"
      @node-click="nodeClick"
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
    <!-- :default-expanded-keys="[1]" -->
  </div>
</template>

<script>
  import * as api from '@/store/api'
  // let id = 1000
  export default {
    components: {
    },
    data () {
      return {
        data: [],
        showAdd: 1,
        data4: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created () {
      this.getTreeData()
    },
    methods: {
      nodeClick (node) {
        this.showAdd = node.id
        console.log(node)
      },
      // 获取树节点数据
      getTreeData () {
        api.getUnitFirst().then(res => {
          this.data = res.data.r.data
        })
      },
      append (data) {
        console.log(data)
        // const newChild = { id: id++, label: 'testtest', children: [] }
        // if (!data.children) {
        //   this.$set(data, 'children', [])
        // }
        // data.children.push(newChild)
      },
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      renderContent (h, { node, data, store }) {
        let myItem = node.childNodes.length > 0 ? <i class="icfont iconfont icon-yonghuliebiao"></i> : null
        let addBtn = this.showAdd === data.id ? (
            <el-popover
              placement="right"
              width="50"
              trigger="hover">
              <div class="addji" on-click={ () => this.append(data) }>添加同级</div>
              <div class="addji" on-click={ () => this.append(data) }>添加子级</div>
              <el-button slot="reference" style="font-size: 12px;" type="text">添加</el-button>
            </el-popover>) : null
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              { myItem }
              <span style="margin-left: 6px">{node.label}</span>
            </span>
            <span style="margin-right: 20px">
              { addBtn }
            </span>
          </span>)
      }
    }
  }
</script>

<style lang="scss" type="text/scss" scoped>
    $fontFamily: "SimHei";
    $fontFamilys: "Microsoft YaHei";
    $font: "SimSun";
    $ST: '宋体';
    .wraper{
      box-sizing: border-box;
      width: 320px;
      height: 100%;
      padding: 20px 0 20px 20px;
    }
</style>
