import _isObject from 'lodash/isObject'
import vueInstance from '../../main'
import _slice from 'lodash/slice'
import cloneDeep from 'lodash/cloneDeep'
import _forEach from 'lodash/forEach'
/**
 * 获取id
 * @returns {*|string|!Array.<T>}
 */
export const getuuid = () => {
  let [s, hexDigits] = [[], '0123456789abcdef']
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return (s.join(''))
}

/**
 * 获取store
 * @returns {*}
 */
export const getInstanceStore = () => {
  let store = null
  if (vueInstance && vueInstance.$children && vueInstance.$children[0]) {
    store = vueInstance.$children[0].$store
  }
  return store
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
  return ((elem.getAttribute) && (elem.getAttribute('class'))) || ''
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
  if (strObj) {
    return JSON.parse(strObj)
  } else {
    return null
  }
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

/**
 * 对所有数据排序
 * @param result
 * @param point
 */
export const sortAllData = (result, point) => {
  try {
    let wgs84Sphere = new ol.Sphere(6378137)
    let sourceProj = config.Maps.map.getView().getProjection()
    if (result && result.length > 0) {
      result.forEach(item => {
        let _point_ = config.Maps.getGeomFromGeomData(item)
        if (_point_) {
          let c1 = ol.proj.transform(_point_.getCoordinates(), sourceProj, 'EPSG:4326')
          let _point = ol.proj.transform(point, sourceProj, 'EPSG:4326')
          item['attributes']['distance'] = wgs84Sphere.haversineDistance(c1, _point)
        }
      })
    }
    result.sort(function (a, b) {
      return a['attributes']['distance'] > b['attributes']['distance'] ? 1 : -1
    })
    return result
  } catch (e) {
    console.log(e)
  }
}

/**
 * i查询结果处理
 * @param result
 * @param point
 * @returns {{}}
 */
export const sortIQueryData = (point, result) => {
  let wgs84Sphere = new ol.Sphere(6378137)
  let sourceProj = config.Maps.map.getView().getProjection()
  let object = {}
  object.allCount = 0
  object.features = []
  let arr = result.filter((element, index, array) => {
    if (element.data && element.data.length > 0) {
      return element.data.map((ele, _index, _array) => {
        let coord = [ele.longitude, ele.latitude]
        let c1 = ol.proj.transform(coord, sourceProj, 'EPSG:4326')
        let _point = ol.proj.transform(point, sourceProj, 'EPSG:4326')
        ele['distance'] = wgs84Sphere.haversineDistance(c1, _point)
        ele['zh'] = 'K' + parseInt(ele.zxzh) + '+' + (Number(ele.zxzh) - parseInt(ele.zxzh)).toFixed(3) * 1000
        ele['layerName'] = element['layer']['alias']
        return ele
      })
    }
  })
  arr.map((_item, _index) => {
    let items = _item['data'].map((item, index) => {
      return {
        attributes: item,
        geometry: [item.longitude, item.latitude],
        geometryType: 'Point'
      }
    })
    object.features = object.features.concat(items)
    return items
  })
  object.features.sort(function (a, b) {
    return a['attributes']['distance'] > b['attributes']['distance'] ? 1 : -1
  })
  object.allCount = object.features.length
  return object
}

/**
 * Base64 转byte数组
 * @param str
 * @returns {Array}
 */
export const stringToBytes = (str) => {
  let ch = []
  let st = []
  let re = []
  for (let i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i)
    st = []
    do {
      st.push(ch & 0xFF)
      ch = ch >> 8
    }
    while (ch)
    re = re.concat(st.reverse())
  }
  return re
}

/**
 * 字节数组转十六进制字符串
 * @param arr
 * @returns {string}
 * @constructor
 */
export const Bytes2Str = (arr) => {
  let str = ''
  for (let i = 0; i < arr.length; i++) {
    let tmp = arr[i].toString(16)
    if (tmp.length === 1) {
      tmp = '0' + tmp
    }
    str += tmp.toUpperCase()
  }
  return str
}

/**
 * 获取数组中 数组对象某项唯一值
 * @param array
 * @param key
 * @returns {Array}
 */
export const unique = (array, key) => {
  let n = []
  for (let i = 0; i < array.length; i++) {
    if (n.indexOf(array[i][key]) === -1) {
      n.push(array[i][key])
    }
  }
  return n
}

/**
 * 计算线要素线上合理的点（）
 * @param geom
 * @param map
 * @returns {string}
 */
export const getPointFromLine = (geom, map) => {
  let point = {
    'type': 'Point',
    'coordinates': []
  }
  let $G = map.getGeomFromGeomData({
    'type': 'Feature',
    'geometry': {
      'type': 'MultiLineString',
      'coordinates': geom.paths
    },
    'properties': {}
  }, {
    geomType: 'GeoJSON'
  })
  if ($G) {
    let extent = $G.getExtent()
    if (extent) {
      let center = ol.extent.getCenter(extent)
      if (center) {
        point.coordinates = $G.getClosestPoint(center)
      } else {
        point = false
      }
    } else {
      point = false
    }
  } else {
    point = false
  }
  return point
}

/**
 * 格式化wkt数据
 * @param wkt
 * @param options
 */
export const formatWKT = (wkt, options = {}) => {
  if (!wkt) return ''
  let wktFormat = new ol.format.WKT()
  let coordinates = []
  let featureGeom = wktFormat.readGeometry(wkt, {
    dataProjection: options['dataProjection'] ? options['dataProjection'] : undefined,
    featureProjection: options['featureProjection'] ? options['featureProjection'] : undefined
  })
  if (featureGeom) {
    coordinates = featureGeom.getCoordinates()
  }
  return coordinates
}

/**
 * 从要素获取图层名
 * @param $F
 * @returns {string}
 */
export const getLayerNameFrom$F = $F => {
  let $LY = ''
  if ($F) {
    let $ATT = $F.getProperties()
    let $PR = $F.get('params')
    if ($PR && _isObject($PR) && $PR['layerName']) {
      $LY = $PR['layerName']
    } else if ($ATT && $ATT.hasOwnProperty('params') && $ATT['params'] && $ATT['params']['layerName']) {
      $LY = $ATT['params']['layerName']
    } else if ($ATT && $ATT['layerName']) {
      $LY = $ATT['layerName']
    }
  }
  return $LY
}

/**
 * 获取列表图标
 * @param layerName
 * @param attr
 * @param hover
 * @returns {string}
 */
export const getWarnIcon = (layerName, attr, hover) => {
  let style = {
    image: {
      type: 'icon',
      image: {
        imageSrc: './static/images/point.png',
        imageAnchor: [0.5, 1]
      }
    }
  }
  let $CF = config.layerConfig.getLayerConfigByLayerName(layerName, 'layers')
  if ($CF) {
    switch ($CF['layerName']) {
      case 'traffic':
        style.image.image.imageSrc = (hover === true ? $CF['icons'][attr['status']] + '_hover' : $CF['icons'][attr['status']]) + '.png'
        break
      case 'handle':
        if (attr && attr.hasOwnProperty('BLOCK_TYPE')) {
          if (attr['BLOCK_TYPE'] === 1) {
            style.image.image.imageSrc = (hover === true ? $CF['icons'][1] + attr['BLOCK_STATUS'] + '_hover' : $CF['icons'][1] + attr['BLOCK_STATUS']) + '.png'
          } else {
            style.image.image.imageSrc = (hover === true ? $CF['icons'][attr['BLOCK_TYPE']] + '_hover' : $CF['icons'][attr['BLOCK_TYPE']]) + '.png'
          }
        }
        break
      case 'seemingly':
        style.image.image.imageSrc = (hover === true ? $CF['icons']['hover'] : $CF['icons']['icon']) + '.png'
        break
      case 'controlSfz':
        style.image.image.imageSrc = (hover === true ? $CF['icons'][attr['control_type']] + '_hover' : $CF['icons'][attr['control_type']]) + '.png'
        break
      case 'controlRoad':
        style.image.image.imageSrc = (hover === true ? $CF['icons']['hover'] : $CF['icons']['icon']) + '.png'
        break
    }
  }
  return style
}

/**
 * 获取事件详情中心点图标
 * | key | type | desc |
 * | :--- | :--- | :--- |
 * | `11` | `block_11` | 地质灾害 |
 * | `13` | `block_13` | 气象灾害 |
 * | `14` | `block_14` | 事故灾害 |
 * | `15` | `block_15` | 其他（突发性 |
 * | `17` | `block_17` | 重大灾害 |
 * | `21` | `block_21` | 施工养护 |
 * | `22` | `block_22` | 重大活动 |
 * | `23` | `block_23` | 其他（计划性 |
 * @param data_
 * @returns {{image: {type: string, image: {imageSrc: string, imageAnchor: number[]}}}}
 */
export const getEventDetailIcon = data_ => {
  const type_ = typeof data_['block_reason_id'] === 'string' && data_['block_reason_id'].slice(0, 2)
  if (type_) {
    return {
      image: {
        type: 'icon',
        image: {
          imageSrc: './static/images/warnplot/block_' + type_ + '/' + (data_['block_status'] ? data_['block_status'] : 1) + '.png',
          imageAnchor: [0.5, 1]
        }
      }
    }
  } else {
    return {
      image: {
        type: 'icon',
        image: {
          imageSrc: './static/images/icons/warn/marker.png',
          imageAnchor: [0.5, 1]
        }
      }
    }
  }
}

export const getEventsPointStyle = (item, hover) => {
  const type_ = typeof item['block_reason_id'] === 'string' && item['block_reason_id'].slice(0, 2)
  if (type_) {
    return {
      image: {
        type: 'icon',
        image: {
          imageSrc: './static/images/warnplot/block_' + type_ + '/' + (item['block_status'] ? item['block_status'] : 4) + '.png',
          imageAnchor: [0.5, 1]
        }
      }
    }
  } else {
    return {
      image: {
        type: 'icon',
        image: {
          imageSrc: './static/images/icons/warn/marker.png',
          imageAnchor: [0.5, 1]
        }
      }
    }
  }
}

/**
 * 处理区划数据
 * @param data
 * @param num
 * @returns {*}
 */
export const getDrawElementData = (data, num) => {
  let listObject = []
  let type = ['horizontal', 'vertical', '']
  for (let i = 0; i < data.length; i++) {
    if (i !== 0 && (i + 1) % num === 0) {
      listObject.push(_slice(data, i + 1 - num, i + 1))
      let lastArray = _slice(data, i + 1, data.length)
      if (lastArray.length <= num) {
        listObject.push(lastArray)
        break
      }
    } else if (data.length < num) {
      listObject.push(data)
      break
    }
  }
  // TODO 倒序数据并转换前后值。
  for (let j = 0; j < listObject.length; j++) {
    if ((j + 1) % 2 === 0) {
      let $DPD = cloneDeep(listObject[j])
      if ($DPD) {
        _forEach($DPD, (item, index) => {
          if (index === 0 && listObject[j].length > 1) {
            listObject[j][index]['value'] = 0
            listObject[j][index + 1]['value'] = $DPD[index]['value']
            listObject[j][index + 1]['piles'] = $DPD[index]['piles']
            listObject[j][index + 1]['region'] = $DPD[index]['region']
          } else if (index > 0 && listObject[j].length > 1 && index < listObject[j].length - 2) {
            listObject[j][index + 1]['value'] = $DPD[index]['value']
            listObject[j][index + 1]['piles'] = $DPD[index]['piles']
            listObject[j][index + 1]['region'] = $DPD[index]['region']
          } else if (listObject[j].length > 1 && index === listObject[j].length - 2) {
            listObject[j][index + 1]['ownValue'] = listObject[j][index + 1]['value']
            listObject[j][index + 1]['ownPiles'] = listObject[j][index + 1]['piles']
            listObject[j][index + 1]['ownRegion'] = listObject[j][index + 1]['region']
            listObject[j][index + 1]['value'] = $DPD[index]['value']
            listObject[j][index + 1]['region'] = $DPD[index]['region']
            listObject[j][index + 1]['piles'] = $DPD[index]['piles']
          } else {
            console.log(listObject[j][index])
          }
        })
      }
      if (listObject[j] && listObject[j].length > 0) {
        listObject[j] = listObject[j].reverse()
      } else {
        listObject.pop()
      }
    }
  }
  listObject.forEach((items, index) => {
    if (items.length < num) {
      _forEach(items, (item, i) => {
        if ((index + 1) % 2 === 0) {
          if (i === 0) {
            if (items.length > 1) {
              item['lineType'] = [type[0]]
            } else {
              item['lineType'] = type[2]
            }
          } else if ((i + 1) % num === 0 && index !== listObject.length - 1 && !(i === items.length - 1)) {
            item['lineType'] = type[1]
          } else if (i === items.length - 1) {
            item['lineType'] = type[2]
          } else {
            item['lineType'] = type[0]
          }
        } else {
          if (i === 0 && i !== items.length - 1) {
            item['lineType'] = type[0]
          } else if (i === items.length - 1) {
            item['lineType'] = type[2]
          } else if ((i + 1) % num === 0) {
            item['lineType'] = type[1]
          } else {
            item['lineType'] = type[0]
          }
        }
      })
    } else {
      items.forEach((item, i) => {
        if ((index + 1) % 2 === 0) {
          if (i === 0 && listObject[index + 1] && listObject[index + 1].length > 0) {
            item['lineType'] = [type[0], type[1]]
          } else if (i === 0 && !listObject[index + 1]) {
            item['lineType'] = [type[0]]
          } else if ((i + 1) % num === 0 && index !== listObject.length - 1 && !(i === items.length - 1)) {
            item['lineType'] = type[1]
          } else if (i === items.length - 1) {
            item['lineType'] = type[2]
          } else {
            item['lineType'] = type[0]
          }
        } else {
          if (i === 0) {
            item['lineType'] = type[0]
          } else if ((i + 1) % num === 0) {
            if (listObject[index + 1]) {
              item['lineType'] = type[1]
            } else {
              item['lineType'] = type[2]
            }
          } else {
            item['lineType'] = type[0]
          }
        }
      })
    }
  })
  return listObject
}

export const keySort = (key, desc) => {
  return function (a, b) {
    return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key])
  }
}

export const addZero = (s) => {
  return s < 10 ? '0' + s : s
}
