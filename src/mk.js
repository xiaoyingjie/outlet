const mkTree = (data) => {
  data.map(item => {
    if (item.zj) {
      let com = () => import('./views' + item.zj + '.vue')
      item.component = com
    }
    item.showChild = false
  })
  var rst = []
  data.map(item => {
    if (item.pid === '0') {
      rst.push(item)
    }
  })
  rst.map(item => {
    listtotree(data, item.pid)
  })
  return rst
}
const getXzqhA = () => {
  let options = JSON.parse(window.sessionStorage.getItem('ctOptions'))
  return options
}
const dealXzqu = (code) => {
  code += ''
  let arr
  let f = code.substr(0, 2)
  let s = code.substr(2, 2)
  let t = code.substr(4, 2)
  if (s === '00') {
    arr = [code]
    return arr
  }
  if (t === '00') {
    let r1 = f + '0000'
    arr = [r1, code]
    return arr
  }
  let r1 = f + '0000'
  let r2 = f + s + '00'
  arr = [r1, r2, code]
  return arr
}
function listtotree (data, pid) {
  var result = []
  var temp
  data.map(item => {
    if (item.pid === pid) {
      temp = listtotree(data, item.id)
      if (temp.length > 0) {
        item.children = temp
      }
      result.push(item)
    }
  })
  return result
}

const environmentalTree = (data) => {
  var rst = []
  data.map(item => {
    if (item.parentcode === '') {
      rst.push(item)
    }
  })
  rst.map(item => {
    listtoETree(data, item.parentcode)
  })
  return rst
}
function listtoETree (data, parentcode) {
  var result = []
  var temp
  data.map(item => {
    if (item.parentcode === parentcode) {
      temp = listtoETree(data, item.code)
      if (temp.length > 0) {
        item.children = temp
      }
      result.push(item)
    }
  })
  return result
}

export {mkTree, environmentalTree, getXzqhA, dealXzqu}
