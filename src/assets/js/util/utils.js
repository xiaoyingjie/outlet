/**
 * 小于10 补位0
 * @param value
 * @returns {*}
 */
export const addZero = value => {
  if (value < 10 && (typeof value === 'number')) {
    return '0' + value
  } else {
    return value
  }
}

// 设置cookies
export const cookies = {
  set: (name, value, days) => {
    let d = new Date()
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days)
    window.document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString()
  },

  get: (name) => {
    let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
    return v ? v[2] : null
  },

  delete: (name) => {
    let date = new Date()
    date.setTime(date.getTime() - 10000)
    window.document.cookie = name + '=v; expires=' + date.toGMTString()
  }
}

/**
 * 获取id
 * @returns {*|string|!Array.<T>}
 */
export const getuuid = () => {
  let [ s, hexDigits ] = [ [], '0123456789abcdef' ]
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return (s.join(''))
}

/**
 * 去除字符串前后空格
 * @param str
 * @returns {*}
 */
export const trim = (str) => {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '')
}

/**
 * 将类名截取成数组
 * @param str
 * @returns {Array|*}
 */
export const splitWords = (str) => {
  return trim(str).split(/\s+/)
}

/**
 * 获取dom class
 * @param elem
 * @returns {*|getAttribute|string|string}
 */
export const getClass = (elem) => {
  return elem.getAttribute && elem.getAttribute('class') || ''
}

/**
 * 判断DOM对象是否有此类名
 * @param el
 * @param name
 * @returns {boolean}
 */
export const hasClass = (el, name) => {
  if (el.classList !== undefined) {
    return el.classList.contains(name)
  }
  let className = getClass(el)
  return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className)
}

/**
 * 添加类名
 * @param el
 * @param name
 */
export const addClass = (el, name) => {
  if (el.classList !== undefined) {
    let classes = splitWords(name)
    for (let i = 0, len = classes.length; i < len; i++) {
      el.classList.add(classes[i])
    }
  } else if (!hasClass(el, name)) {
    let className = getClass(el)
    setClass(el, (className ? className + ' ' : '') + name)
  }
}

/**
 * 移除类名
 * @param el
 * @param name
 */
export const removeClass = (el, name) => {
  if (el.classList !== undefined) {
    el.classList.remove(name)
  } else {
    setClass(el, String.trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')))
  }
}

/**
 * 设置class
 * @param el
 * @param name
 */
export const setClass = (el, name) => {
  if (el.className.baseVal === undefined) {
    el.className = name
  } else {
    el.className.baseVal = name
  }
}

/**
 * 设置缓存
 * @param key
 * @param obj
 */
export const setSessionStorage = (key, obj) => {
  let strObj = JSON.stringify(obj)
  window.sessionStorage.setItem(key, strObj)
}

/**
 * 获取缓存
 * @param key
 */
export const getSessionStorage = (key) => {
  let strObj = window.sessionStorage.getItem(key)
  return JSON.parse(strObj)
}

/**
 * 移除缓存
 * @param key
 */
export const removeSessionStorage = (key) => {
  window.sessionStorage.removeItem(key)
}

/**
 * 移除所有缓存
 */
export const clearAllSessionStorage = () => {
  window.sessionStorage.clear()
}

/**
 * 设置缓存
 * @param key
 * @param obj
 */
export const setLocalStorage = (key, value) => {
  window.localStorage.removeItem(key)
  let isObject = value instanceof Object
  let time = new Date().getTime()
  let age = 2 * 24 * 60 * 60 * 1000
  let info = {}
  if (!isObject) {
    info._value = value
  } else {
    info = JSON.parse(JSON.stringify(value))
  }
  info._time = time
  info._overtime = time + age
  info._isObject = isObject
  localStorage.setItem(key, JSON.stringify(info))
  return info
}

/**
 * 判断缓存是否过期
 * @param key
 */
export const expireStorage = (key) => {
  let isExpire = true
  let value = localStorage.getItem(key)
  let time = new Date().getTime()
  if (value) {
    value = JSON.parse(value)
    isExpire = time > value._age
  } else {
    isExpire = true
  }
  return isExpire
}

/**
 * 获取缓存
 * @param key
 */
export const getLocalStorage = (key) => {
  let isExpire = expireStorage(key)
  let value = null
  if (!isExpire) {
    value = JSON.parse(localStorage.getItem(key))
    if (!value._isObject) {
      value = value._value
    }
  }
  return value
}
/**
 * 保存周边搜索图标
 * @param source
 * @param item
 */
export const saveMarkOverLay = (source, item) => {
  if (source && item) {
    let _souce = getSessionStorage(source)
    if (_souce && Array.isArray(_souce)) {
      if (!hasMarkOverLay(source, item)) {
        _souce.push(item)
      }
    } else {
      _souce = [item]
    }
    setSessionStorage(source, _souce)
  }
}

/**
 * 判断是否有此数据
 * @param source
 * @param item
 * @returns {boolean}
 */
export const hasMarkOverLay = (source, item) => {
  let flag = false
  if (source && item) {
    let _souce = getSessionStorage(source)
    if (_souce && Array.isArray(_souce)) {
      _souce.every(_item => {
        if (_item === item) {
          flag = true
          return false
        } else {
          return true
        }
      })
    }
  }
  return flag
}
/**
 * 从缓存中移除
 * @param source
 * @param item
 */
export const removeMarkOverLay = (source, item) => {
  if (source && item && hasMarkOverLay(source, item)) {
    let _souce = getSessionStorage(source)
    if (_souce && Array.isArray(_souce)) {
      let items = _souce.filter(_item => {
        return (_item !== item)
      })
      setSessionStorage(source, items)
    }
  }
}
/**
 * 从缓存中获取
 * @param source
 * @returns {string}
 */
export const getMarkOverLay = source => {
  let ids = ''
  if (source) {
    let lists = getSessionStorage(source)
    if (lists && Array.isArray(lists) && lists.length > 0) {
      ids = lists.join(',')
    }
  }
  return ids
}

// 度分秒转经纬度
export const formatZB = (val1, val2, val3) => {
  if (val1 === '') {
    val1 = 0
  }
  if (val2 === '') {
    val2 = 0
  }
  if (val3 === '') {
    val3 = 0
  }
  val1 = parseFloat(val1)
  val2 = parseFloat(val2)
  val3 = parseFloat(val3)
  if (val3) {
    val3 = (val3 / 60)
  }
  if (val2) {
    val2 = ((val2 + val3) / 60)
  }
  return val1 + val2
}
// 经纬度转度分秒
export const ZBformat = (val) => {
  let d = null
  let va = null
  let f = null
  let m = null
  let temp = null
  if (val) {
    if (val.indexOf('.') > -1) {
      let arr = val.split('.')
      d = arr[0]
      temp = arr[1] * 60 + ''
      if (arr[1] !== null && temp.indexOf('.') > -1) {
        va = temp.split('.')
        f = va[0]
        m = va[1] * 60
        return d + '°' + f + '\'' + m + '"'
      } else {
        let t = (val - d) * 60
        t = t + ''
        f = t.split('.')[0]
        m = (t - t.split('.')[0]) * 60
        console.log(d + '°' + f + '\'' + m + '"')
        return d + '°' + f + '\'' + m + '"'
      }
    } else {
      d = val
      return d
    }
  }
}

// 数组去重
export const uniqeByKeys = (array, key) => {
  var result = []
  var hash = {}
  for (var i = 0; i < array.length; i++) {
    if (!hash[array[i].key]) {
      result.push(array[i])
      hash[array[i].key] = true
    }
  }
  return result
}
