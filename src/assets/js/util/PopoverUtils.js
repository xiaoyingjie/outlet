/**
 * Created by FDD on 2017/6/7.
 * @desc 气泡公用方法
 */
import * as PopupUtil from '../../../components/popups/index'
/**
 * 气泡
 * @param coords
 * @param params
 */
export const showPopover = (coords, params) => {
  if (config.popup) {
    config.Maps.map.removeOverlay(config.popup)
    config.popup = null
  }
  let popup = new HMap.Popover(config.Maps, {
    id: params['id'] + '-popover',
    layerName: params['layerName'] + '-popover',
    offset: (params['offset'] ? params['offset'] : [255, 45]),
    showCloser: false,
    showMarkFeature: false,
    showMinimize: false,
    properties: params
  })
  config.popup = popup
  // 区分路线和图层叠加点的实例
  if (params['layerName'] !== 'gl_lx') {
    if (params['layerName'] === 'gisroadevents' || params['layerName'] === 'trafficWeather' || params['layerName'] === 'roadSituation') {
      PopupUtil.getPops('Popup')
    } else if (params['layerName'] === 'warning') {
      PopupUtil.getPops('warningPopup')
      params['coordinates'] = coords
    } else {
      PopupUtil.getPops('FeaturePopup')
      params['coordinates'] = coords
    }
    let element = PopupUtil.getPopupElement(params)
    config.Maps.map.addOverlay(popup)
    popup.show(coords, element)
  }
}

/**
 * 应急标绘的文本编辑器
 * @param coords
 * @param params
 */
export const showEditor = (coords, params) => {
  let popup = new HMap.Popover(config.Maps, {
    id: params['id'] + '-popover',
    offset: (params['offset'] ? params['offset'] : [255, 45]),
    showCloser: false,
    showMarkFeature: false,
    showMinimize: false,
    properties: {
      type: 'editor'
    }
  })
  PopupUtil.getPops('editor')
  let element = PopupUtil.getPopupElement(params)
  config.Maps.map.addOverlay(popup)
  popup.show(coords, element)
}
