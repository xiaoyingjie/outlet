import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import components from './src'
let currentPopup
let instance
let Template
const popovers = []

const getPopover = function (_str) {
  Template = Vue.extend(components[_str])
}

// 默认回调
const defaultCallback = action => {
  if (currentPopup) {
    let callback = currentPopup.callback
    if (typeof callback === 'function') {
      callback(action)
    } else {
      closePopover()
    }
  }
}

// 创建实例
const initInstance = () => {
  instance = new Template({
    router,
    store,
    el: document.createElement('div')
  })
  instance.callback = defaultCallback
}

const getPopoverElement = (type, options) => {
  if (!type) return
  getPopover(type)
  initInstance()
  instance.action = ''
  if (popovers.length > 0) {
    let _options = currentPopup.get('options')
    if (_options.callback === undefined) {
      instance.callback = defaultCallback
    }
    for (let prop in _options) {
      if (_options[prop]) {
        instance[prop] = _options[prop]
      }
    }
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.visible = true
    })
  }
  return instance.$el
}

function closePopover () {
  if (instance && instance.doClose) {
    instance.doClose()
  }
  if (currentPopup) {
    Vue.prototype.$Maps.removeOverlay(currentPopup)
    currentPopup = null
  }
}

function clearAll () {
  if (popovers && popovers.length > 0) {
    for (let i = 0; i < popovers.length; i++) {
      Vue.prototype.$Maps.removeOverlay(popovers[i])
      popovers.splice(i, 1)
    }
  }
}

const showPopover = (type, map, options = {}, closeLast = true) => {
  // if (closeLast) closePopover()
  // closePopover()
  currentPopup = new HMap.Popover(map, {
    id: options['id'] + '-popover',
    layerName: options['layerName'] + '-popover',
    offset: (options['offset'] ? options['offset'] : [60, -45]),
    showCloser: false,
    showMarkFeature: false,
    showMinimize: false,
    properties: options['properties'],
    insertFirst: (options.hasOwnProperty('insertFirst') ? options['insertFirst'] : false)
  })
  currentPopup.set('options', options)
  popovers.push(currentPopup)
  map.addOverlay(currentPopup)
  currentPopup.show(options['coordinates'], getPopoverElement(type, options))
  if (options['zoomToExtent']) {
    const pixel = map.getPixelFromCoordinate(options['coordinates'])
    if (pixel) {
      pixel[1] = pixel[1] - 200
      const $CR = map.getCoordinateFromPixel(pixel)
      map.getView().animate({
        center: $CR,
        duration: 800
      })
    }
  }
}

Vue.prototype.$ShowPopover = showPopover
Vue.prototype.$ClearAllPopover = clearAll
Vue.prototype.$ClosePopover = closePopover
export default showPopover
export { showPopover, closePopover, clearAll }
