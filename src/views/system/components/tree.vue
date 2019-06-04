<template>
  <div class="treeWraps" style="height: 100%" v-loading.treeWraps="loading">
    <ul id="treeDemo" class="ztree"></ul>
    <div id="rMenu">
      <ul>
        <li v-if="false"  @click="addTreeNode(1)">添加同级</li>
        <li @click="addTreeNode(2)" id="m_add2" v-if="cLength !== 5 || cLength !== 13">添加下属工作单位或机构</li>
        <li @click="edit" id="editor" v-if="targetNodes.iu !== 1">编辑下属工作单位或机构</li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" type="text/scss">
  .ztree li span.button.root_open {
    background: url("../../../../static/images/gbwj.png") no-repeat !important;
  }
  .ztree li span.button.root_close {
    background: url("../../../../static/images/dkwj.png") no-repeat !important;
  }
  .ztree li span.button.roots_open{
    background: url("../../../../static/images/gbwj.png") no-repeat !important;
  }
  .ztree li span.button.roots_close{
    background: url("../../../../static/images/dkwj.png") no-repeat !important;
  }
  .ztree li span.button.ico_open{
    background: url("../../../../static/images/wjjdk.png") no-repeat !important;
  }
  .ztree li span.button.ico_close{
    background: url("../../../../static/images/wjj.png") no-repeat !important;
  }
  .ztree li span.button.ico_docu{
    background: url("../../../../static/images/wjmc.png") no-repeat !important;
  }
  .ztree li span.button.center_open{
    background: url("../../../../static/images/gbwj.png") no-repeat !important;
  }
  .ztree li span.button.center_close{
    background: url("../../../../static/images/dkwj.png") no-repeat !important;
  }
  .ztree li span.button.bottom_open{
    background: url("../../../../static/images/gbwj.png") no-repeat !important;
  }
  .ztree li span.button.bottom_close{
    background: url("../../../../static/images/dkwj.png") no-repeat !important;
  }

  #treeDemo {
    padding: 0 15px;
  }

  #treeDemo li {
    line-height: 20px;
  }

  #treeDemo li span {
    font-family: "宋体";
    font-size: 12px;
    color: #000;
  }

  #rMenu {
    position: absolute;
    /*visibility: hidden;*/
    display: none;
    top: 0;
    text-align: left;
    width: 150px;
    border: 1px solid #dcdcdc;
    background: #fff;
    box-shadow: 4px 4px 5px rgba(4, 14, 49, 0.1);
    overflow: hidden;
  }

  #rMenu ul li {
    margin: 1px 0;
    padding: 0 5px;
    line-height: 30px;
    cursor: pointer;
    font-family: "宋体";
    font-size: 12px;
    color: #323232;
    padding-left: 10px;
    &:nth-child(1) {
      margin-top: 4px;
    }
    &:hover {
      background: #F0F2F4;
    }
  }
</style>
<script>
  import * as api from '../../../store/api'
  export default {
    data () {
      return {
        zTree: '',
        rMenu: '',
        addCount: 1,
        targetNodes: '',
        addTreeData: {},
        loading: true,
        clickNum: '',
        cLength: 0,
        isEdit: true,
        jobUnitCode: ''
      }
    },
    mounted () {
      this.getTreeData()
      this.rMenu = $('#rMenu')
    },
    methods: {
      // 获取树节点数据
      getTreeData () {
        api.getUnitFirst({userName: 'system'}).then(res => {
          let data = res.data.r.data
          this.jobUnitCode = data[0].c
          data.map(item => {
            if (item.ty === 0 || item.ty === 1 || item.ty === 2 || item.ty === 3) {
              item.isParent = true
            }
          })
          this.initzTree(data)
        })
      },
      // 初始化树
      initzTree (zNodes) {
        let setting = {
          view: {
            selectedMulti: false
          },
          data: {
            key: {
              children: 'nodes',
              name: 'n'
            },
            simpleData: {
              idKey: 'id',
              pIdKey: 'pc'
            }
          },
          async: {
            enable: true,
            url: config.baseUrlcs1 + 'unit/getUnit',
            autoParam: ['id'],
            dataFilter: this.dataFilter
          },
          callback: {
            beforeClick: this.zTreebeforeClick,
            onNodeCreated: this.zTreeOnNodeCreated,
            onRename: this.zTreeOnRename
          }
        }
        this.zTree = $.fn.zTree.init($('#treeDemo'), setting, zNodes)
        this.$emit('selectDept', {c: zNodes[0].c, n: zNodes[0].n, id: '', f: 1})
        this.loading = false
      },
      zTreebeforeClick (treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
        if (treeObj.isSelectedNode(treeNode)) {
          treeObj.cancelSelectedNode(treeNode)
          this.$set(treeNode, 'uc', '')
          this.$emit('selectDept', {c: '', n: '', id: '', nodata: true})
          this.$emit('selectDept', {c: treeNode.c, n: '', id: '', jobUnitCode: this.jobUnitCode, nodata: true})
          return false
        } else {
          this.$set(treeNode, 'uc', treeNode.c)
          this.$emit('selectDept', {c: treeNode.uc, n: treeNode.n, id: treeNode.id, jobUnitCode: this.jobUnitCode})
          this.$store.dispatch('SET_DEPT', {
            c: treeNode.uc,
            n: treeNode.n
          })
          this.$store.dispatch('SEARCH_STR', '')
        }
      },
      // 默认选中第一个
      zTreeOnNodeCreated (event, treeId, treeNode) {
        var treeObj = $.fn.zTree.getZTreeObj('treeDemo')
        var node = treeObj.getNodeByParam(treeNode.n)
        treeObj.selectNode(node)
      },
      dataFilter (treeId, parentNode, responseData) {
        if (responseData) {
          if (responseData.r.data) {
            let data = responseData.r.data
            data.map(item => {
              if (item.ty === 0 || item.ty === 1 || item.ty === 2 || item.ty === 3) {
                item.isParent = true
              }
            })
            return data
          }
        }
      },
      onBodyMouseDown (event) {
        if (!(event.target.id === 'rMenu' || $(event.target).parents('#rMenu').length > 0)) {
          this.rMenu.css({'display': 'none'})
        }
      },
      addTreeNode (num) {
        this.clickNum = num
        let nodes = this.zTree.getSelectedNodes()
        var treeNode = nodes[0]
        let ip = nodes.isParent
        this.hideRMenu()
        if (num === 2) {
          // 添加子集
          treeNode = this.zTree.addNodes(treeNode, {
            pc: treeNode.c,
            isParent: ip,
            name: 'new node' + (this.addCount++)
          })
        } else {
          // 添加同级
          let pID = this.targetNodes.parentTId
          let v = this.zTree.getNodeByTId(pID)
          treeNode = this.zTree.addNodes(v, {
            c: treeNode.c,
            pc: treeNode.pc,
            isParent: ip,
            name: 'new node' + (this.addCount++)
          })
        }
        if (treeNode) {
          this.zTree.editName(treeNode[0])
        } else {
          window.alert('叶子节点被锁定，无法增加子节点')
        }
      },
      //  编辑完成后显示所编辑的信息
      zTreeOnRename (event, treeId, treeNode) {
        this.addTreeData.pc = treeNode.pc
        this.addTreeData.n = treeNode.n
        this.addTreeData.iu = 0
        if (this.clickNum === 1) {
          this.addTreeData.uc = treeNode.c
          this.addTreeData.id = ''
          api.addUnit(this.addTreeData).then(res => {
            if (res.data.c === 1) {
              let nodes = this.zTree.getSelectedNodes()
              this.$set(nodes[0], 'uc', res.data.r.uc)
              this.$set(nodes[0], 'id', res.data.r.id)
              this.$set(nodes[0], 'pc', res.data.r.pc)
              this.zTree.reAsyncChildNodes(nodes[0], 'refresh', false)
              this.$store.dispatch('SET_DEPT', {
                c: nodes[0].uc,
                n: nodes[0].n
              })
            }
          })
          this.clickNum = ''
        } else if (this.clickNum === 2) {
          // 添加子集
          let sNodes = this.zTree.getSelectedNodes()
          this.addTreeData.pc = sNodes[0].pc
          this.addTreeData.uc = ''
          this.addTreeData.id = ''
          api.addChild(this.addTreeData).then(res => {
            if (res.data.c === 1) {
              let nodes = this.zTree.getSelectedNodes()
              this.$set(nodes[0], 'uc', res.data.r.uc)
              this.$set(nodes[0], 'id', res.data.r.id)
              this.$set(nodes[0], 'pc', res.data.r.pc)
              this.zTree.reAsyncChildNodes(nodes[0], 'refresh', false)
              this.$store.dispatch('SET_DEPT', {
                c: nodes[0].uc,
                n: nodes[0].n
              })
            }
          })
          this.clickNum = ''
        }
        if (this.isEdit) {
          this.addTreeData.uc = treeNode.uc
          this.addTreeData.id = treeNode.id
          api.updateUnit(this.addTreeData).then(res => {
            if (res.data.c === 1) {
              let nodes = this.zTree.getSelectedNodes()
              this.$set(nodes[0], 'uc', res.data.r.uc)
              this.$set(nodes[0], 'id', res.data.r.id)
              this.$set(nodes[0], 'pc', res.data.r.pc)
              this.zTree.reAsyncChildNodes(nodes[0], 'refresh', false)
              this.$store.dispatch('SET_DEPT', {
                c: nodes[0].uc,
                n: nodes[0].n
              })
            }
          })
          this.isEdit = false
        }
      },
      hideRMenu () {
        if (this.rMenu) this.rMenu.css({'display': 'none'})
        $('body').unbind('mousedown', this.onBodyMouseDown)
      },
      edit () {
        let nodes = this.zTree.getSelectedNodes()
        let treeNode = nodes[0]
        this.addTreeData.id = treeNode.id
        this.$set(nodes[0], 'uc', treeNode.uc)
        if (nodes.length === 0) {
          window.alert('请先选择一个节点')
          return
        }
        this.zTree.editName(treeNode)
        $('#rMenu').hide()
        this.isEdit = true
      }
    }
  }
</script>
