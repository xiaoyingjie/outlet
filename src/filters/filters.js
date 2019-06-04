import moment from 'moment'
export default {
  formatIf (value) {
    if (value === 1) {
      return '是'
    }
    if (value === 0) {
      return '否'
    }
    return '-'
  },
  formatState (value) {
    if (value === 0) {
      return '启用'
    }
    if (value === 1) {
      return '禁用'
    }
    if (value === '0') {
      return '启用'
    }
    if (value === '1') {
      return '禁用'
    }
    return '-'
  },
  formatRole (value) {
    if (value === 0) {
      return '管理员'
    }
    if (value === 1) {
      return '普通用户'
    }
    if (value === '0') {
      return '管理员'
    }
    if (value === '1') {
      return '普通用户'
    }
    return '-'
  },
  formatIfzz (value) {
    if (value === 0) {
      return '未整治'
    }
    if (value === 1) {
      return '已整治'
    }
    if (value === 2) {
      return '已整治'
    }
  },
  formatCollectType (value) {
    if (value === 0) {
      return '自查'
    }
    if (value === 1) {
      return '督察'
    }
    if (value === '0') {
      return '自查'
    }
    if (value === '1') {
      return '督察'
    }
  },
  dateFormat: function (value, format) {
    if (value === undefined) return '-'
    if (!value) return '-'
    if (typeof (value) === 'string') {
      return moment(parseInt(value)).format(format)
    }
    return moment(value).format(format)
  },
  jwd: function (val) {
    let value = Math.abs(val)
    let v1 = Math.floor(value)
    let v2 = Math.floor((value - v1) * 60)
    let v3 = Math.round((value - v1) * 3600 % 60)
    return v1 + '°' + v2 + '′' + v3 + '″'
  },
  formatSourceId (val) {
    if (val !== null) {
      return '已排查'
    } else {
      return '未排查'
    }
  },
  funcGdpfwz (val) {
    if (val === 0) {
      return '否'
    } else if (val === 1) {
      return '是'
    }
  }
}
