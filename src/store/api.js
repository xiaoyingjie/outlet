import axios from 'axios'
// import {getLocalStorage} from '../assets/js/util/utils'
const defaults = {
  headers: {
    'userName': 'system',
    'token': ''
  }
}

Object.assign(axios.defaults, defaults)

axios.interceptors.request.use(
  configs => {
    if (window.sessionStorage.getItem('to')) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      configs.headers.token = window.sessionStorage.getItem('to')
      configs.headers.userName = window.sessionStorage.getItem('un')
    }
    if (configs.url.indexOf(config.baseUrlcs) < 0) {
      delete configs.headers.token
      // delete configs.headers.userName
    } else {
      configs.headers.token = window.sessionStorage.getItem('to')
      configs.headers.userName = window.sessionStorage.getItem('un')
    }
    return configs
  },
  err => {
    return Promise.reject(err)
  }
)
// 上传图片接口
export const uploadImgUrl = `${config.baseUrlcs}image/uploadOneImage`

// 登录
export const signIn = _params => {
  return axios.post(`user/userlogin`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 登出
export const signOut = _params => {
  return axios.get(`user/userlogout?userId=${_params.userId}`, {
    baseURL: config.baseUrlcs1
  })
}
// 获取个人信息 /user/getUserInfoByUserId
export const userGetUserInfoByUserIdA = _params => {
  return axios.get(`user/getUserInfoByUserId?id=${_params.userId}`, {
    baseURL: config.baseUrlcs1
  })
}
// 编辑用户信息 /user/editUserInfo
export const userEditUserInfoA = (_params) => {
  return axios.post('user/editUserInfo', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 修改密码 /user/setUser
export const userSetUserA = (_params) => {
  return axios.post('user/setUser', _params, {
    baseURL: config.baseUrlcs1
  })
}
// -----------------排污口新接口
// 疑似排口列表 /suspect/getPageList
export const suspectGetPageListA = (_params) => {
  return axios.post('suspect/getPageList', _params, {
    baseURL: config.baseUrlcs
  })
}
// 疑似排口i详情 /suspect/getDetail
export const suspectGetDetailA = (id) => {
  return axios.get('suspect/getDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 编辑排污口信息 /suspect/updateSupect
export const suspectUpdateSupectA = (_params) => {
  return axios.post('suspect/updateSupect', _params, {
    baseURL: config.baseUrlcs
  })
}
// 现场排查列表 /rhpwk/getPageList
export const rhpwkGetPageListA = (_params) => {
  return axios.post('rhpwk/getPageList', _params, {
    baseURL: config.baseUrlcs
  })
}
// 现场排查详情 /rhpwk/getDetail
export const rhpwkGetDetailA = (id) => {
  return axios.get('rhpwk/getDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 现场排查详情编辑 /rhpwk/updatePwkInfo
export const rhpwkUpdatePwkInfoA = (_params) => {
  return axios.post('rhpwk/updatePwkInfo', _params, {
    baseURL: config.baseUrlcs
  })
}
// 监测详情 /rhpwk/getMonitorMessage
export const rhpwkGetMonitorMessageA = (id) => {
  return axios.get('rhpwk/getMonitorMessage?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 新增编辑监测/rhpwk/saveMonitorMessage
export const rhpwkSaveMonitorMessageA = (_params) => {
  return axios.post('rhpwk/saveMonitorMessage', _params, {
    baseURL: config.baseUrlcs
  })
}
// 组长审核列表/audit/getHeadmanAuditList
export const auditGetHeadmanAuditListA = (id) => {
  return axios.get('audit/getHeadmanAuditList?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 组长审核详情/audit/getHeadmanAuditDetail
export const auditGetHeadmanAuditDetailA = (id) => {
  return axios.get('audit/getHeadmanAuditDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 专项办意见列表 /audit/getMinistryAuditList
export const auditGetMinistryAuditListA = (id) => {
  return axios.get('audit/getMinistryAuditList?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 专项办意见详情 /audit/getMinistryAuditDetail
export const auditGetMinistryAuditDetailA = (id) => {
  return axios.get('audit/getMinistryAuditDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 专项办确认列表 /audit/getMinistryConfirmList
export const auditGetMinistryConfirmListA = (id) => {
  return axios.get('audit/getMinistryConfirmList?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 专项办确认详情 /audit/getMinistryConfirmDetail
export const auditGetMinistryConfirmDetailA = (id) => {
  return axios.get('audit/getMinistryConfirmDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 地方意见 列表/audit/getLocalAuditList
export const auditGetLocalAuditListA = (id) => {
  return axios.get('audit/getLocalAuditList?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 地方意见详情 /audit/getLocalAuditDetail
export const auditGetLocalAuditDetailA = (id) => {
  return axios.get('audit/getLocalAuditDetail?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 填报地方意见 /audit/insertLocalAudit
export const auditInsertLocalAuditA = (_params) => {
  return axios.post('audit/insertLocalAudit', _params, {
    baseURL: config.baseUrlcs
  })
}
// 组长审核 /audit/insertHeadmanAudit
export const auditInsertHeadmanAuditA = (_params) => {
  return axios.post('audit/insertHeadmanAudit', _params, {
    baseURL: config.baseUrlcs
  })
}
// 专项办审核 /audit/insertMinistryAudit
export const auditInsertMinistryAuditA = (_params) => {
  return axios.post('audit/insertMinistryAudit', _params, {
    baseURL: config.baseUrlcs
  })
}
// 专项办确认 /audit/insertMinistryConfirm
export const auditInsertMinistryConfirmA = (_params) => {
  return axios.post('audit/insertMinistryConfirm', _params, {
    baseURL: config.baseUrlcs
  })
}
// 疑似排口流程查询 /process/getLiuchengInfoByYswt
export const processGetLiuchengInfoByYswtA = (id) => {
  return axios.get('process/getLiuchengInfoByYswt?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 流程图查询排查 /process/getLiuchengInfoByCheck
export const processGetLiuchengInfoByCheckA = (id) => {
  return axios.get('process/getLiuchengInfoByCheck?id=' + id, {
    baseURL: config.baseUrlcs
  })
}
// 枚举  /rhpwk/getEnum
export const rhpwkGetEnumA = (parcode) => {
  return axios.get('rhpwk/getEnum?parcode=' + parcode, {
    baseURL: config.baseUrlcs
  })
}
// 枚举入海方式 /rhpwk/getNextEnum
export const rhpwkGetNextEnumA = (parcode) => {
  return axios.get('rhpwk/getNextEnum?parcode=' + parcode, {
    baseURL: config.baseUrlcs
  })
}
// 行政区划编码
export const getXzqh = () => {
  return axios.get('xzqh/getXzqh', {
    baseURL: config.baseUrlcs
  })
}
// -----------------排污口新接口

// 获取首次组织机构管理数据
export const getUnitFirst = (_params) => {
  return axios.post('unit/getUnitFirst', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 添加同级部门列表
export const addUnit = (_params) => {
  return axios.post('unit/addVav', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 获当前角色权限
export const getRoleMoudleListNew = roleid => {
  return axios.post(`role/getRoleMoudleListNew?roleid=${roleid}`, '', {
    baseURL: config.baseUrlcs
  })
}
// 获取周边环境
export const getSurroundings = () => {
  return axios.get('surroundings', {
    baseURL: config.baseUrlcs
  })
}
// 根据限定条件查询疑似问题卫星中心列表
export const getSearchList = (_params) => {
  return axios.post('SuspectPro/getSuspectWxzxList', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 电子地图-现场核实列表
export const checkPageList = (_params) => {
  return axios.post('check/pageList', _params, {
    baseURL: config.baseUrlcs
  })
}
// 电子地图-整改列表
export const getZglbList = _params => {
  return axios.post(`/check/getZgjdList`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 获取用户信息
export const getUserInfoByToken = _params => {
  return axios.post(`user/getUserInfoByToken`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 部门列表服务数据
export const getzTree = () => {
  return axios.post('unit/getUnit', '', {
    baseURL: config.baseUrlcs1
  })
}
// 添加子级部门列表
export const addChild = (_params) => {
  return axios.post('unit/addChild', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 更新单位信息
export const updateUnit = (_params) => {
  return axios.post('unit/updateUnit', _params, {
    baseURL: config.baseUrlcs1
  })
}
// 问题清单-疑似问题左侧流程图列表-new
export const AgetLeftLiuchengtu = id => {
  return axios.get(`process/getLiuchengInfoByYswtWxzx?id=${id}`, {
    baseURL: config.baseUrlcs1
  })
}
// 问题清单-疑似问题查询列表
export const getProblemList = _params => {
  return axios.post(`SuspectPro/getSuspectWxzxList`, {}, {
    params: _params,
    baseURL: config.baseUrlcs1
    // baseURL: 'http://192.168.1.183:8511/'
  })
}
//  根据用户类型获取角色列表
export const getRoleList = (id) => {
  return axios.get('user/getRoleListByRoleId?roleId=' + id, {
    baseURL: config.baseUrlcs1
  })
}
//  获取全部权限
export const getMoudleTree = (id) => {
  return axios.post('role/getMoudleTree?roleid=' + id, '', {
    baseURL: config.baseUrlcs
  })
}
//  新增、编辑角色
export const addRole = (_params) => {
  return axios.post(`role/addRole`, _params, {
    baseURL: config.baseUrlcs
  })
}
//  角色详情
export const getRoleDetailById = (id) => {
  return axios.post('role/getRoleDetailById?id=' + id, '', {
    baseURL: config.baseUrlcs
  })
}
// 根据单位id获取单位信息
export const getUnitName = (unitName) => {
  return axios.get('unit/getUnitName?unitName=' + unitName, {
    baseURL: config.baseUrlcs1
  })
}
// 根据单位id获取单位信息
export const getUnitInfoByUnitId = (_params) => {
  return axios.get(`unit/getUnitInfoByUnitId?unitId=${_params.id}`, {
    baseURL: config.baseUrlcs1
  })
}
export const getTypeByUser = type => {
  return axios.get(`user/getSystemQxByType?type=${type}`, {
    baseURL: config.baseUrlcs1
  })
}
export const getRoleListByUserId = userId => {
  return axios.get(`user/getRoleListByUserId?userId=${userId}`, {
    baseURL: config.baseUrlcs1
  })
}
// 新增/编辑用户
export const saveUser = _params => {
  return axios.post(`user/saveUser`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 获取用户信息
export const getUserList = _params => {
  return axios.post(`user/getUserList`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 删除用户
export const deleteUser = _params => {
  return axios.post(`/user/deleteUser`, _params, {
    baseURL: config.baseUrlcs1
  })
}
// 启用
export const enable = _params => {
  return axios.get(`user/enable?id=${_params}`, {
    baseURL: config.baseUrlcs1
  })
}
// 禁用
export const disable = _params => {
  return axios.get(`user/disable?id=${_params}`, {
    baseURL: config.baseUrlcs1
  })
}
// 修改用户密码
export const setUser = _params => {
  return axios.post('user/setUser', _params, {
    baseURL: config.baseUrlcs1
  })
}
