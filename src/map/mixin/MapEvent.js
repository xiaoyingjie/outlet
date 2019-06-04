import _showPopover from '../popover/index'
import {formatWKT, getLayerNameFrom$F} from '../../assets/utils/util'
const isClearObject = [
  'geometry',
  'map',
  'element',
  'offset',
  'positioning',
  'params',
  'style',
  'selectStyle'
]
export default {
  methods: {

    /**
     * 开启事件监听
     */
    onEvent () {
      this.$Maps.on('click', event => {
        let feature = this.$Maps.forEachFeatureAtPixel(event.pixel, feature => {
          return feature
        })
        if (!feature && config.popup) {
          this.$Maps.removeOverlay(config.popup)
          config.popup = null
        } else if (feature && feature instanceof ol.Feature) {
          this.showPopover('feature:onselect', feature, event.coordinate)
        }
      })
    },

    /**
     * 显示气泡
     * @param type
     * @param value
     * @param _coordinates
     */
    showPopover (type, value, _coordinates) {
      try {
        let coordinates = this.getCoordinates(type, value, _coordinates)
        let properties = this.getProperties(type, value)
        properties['id'] = properties['id'] || properties['ID']
        if (properties && properties['id'] && properties['layerName'] && coordinates) {
          this.matchConfig(properties, coordinates)
        }
      } catch (error) {
      }
    },

    /**
     * 匹配相关配置
     * @param properties
     * @param coordinates
     */
    matchConfig (properties, coordinates) {
      if (properties.layerName) {
        switch (properties.layerName) {
          case 'test-point': // test
            coordinates = (coordinates instanceof Array) ? coordinates : formatWKT(coordinates)
            _showPopover('briefInformationBubbleTemplate', this.$Maps.getMap(), {
              id: properties['id'],
              layerName: properties['layerName'],
              coordinates: coordinates,
              properties: properties
            })
            break
          case 'rhzpkPoints':
            this.$router.push({path: 'rhpwkTag', query: {id: properties.id}})
            break
          case 'rhhlPoints':
            this.$router.push({path: 'rhhlTag', query: {id: properties.id}})
            break
          case 'questionPoints':
            this.$router.push({path: 'yswtTag', query: {id: properties.id, pwktype: properties.pwktype}})
            break
          default:
            console.log('不做任何处理')
            break
        }
      }
    },

    /**
     * 获取气泡锚点坐标（点获取空间位置，线要素获取当前点击位置坐标距离线要素
     * 上最近的一个坐标，暂未考虑面要素，对于overlay直接获取其锚点）
     * @param type
     * @param value
     * @param _coordinates
     * @returns {Array}
     */
    getCoordinates (type, value, _coordinates) {
      let coordinates = []
      if (type === 'feature:onselect') {
        if (value && value instanceof ol.Feature && value.getProperties()) {
          if (value.getGeometry().getType() === 'MultiLineString' || value.getGeometry().getType() === 'lineString') {
            // getClosestPoint
            coordinates = value.getGeometry().getClosestPoint(_coordinates)
          } else if (value.getGeometry().getType() === 'Point') {
            coordinates = value.getGeometry().getCoordinates()
          }
        }
      } else if (type === 'overlay:onmouseleft') {
        coordinates = value.getPosition()
      }
      return coordinates
    },

    /**
     * 获取要素属性信息
     * @param type
     * @param value
     * @returns {*}
     */
    getProperties (type, value) {
      let properties
      if (type === 'feature:onselect') {
        properties = value.getProperties()
        let $LY = getLayerNameFrom$F(value)
        if ($LY) {
          properties['layerName'] = $LY
          if (value.getId()) {
            properties['id'] = value.getId()
          } else {
            throw new Error('无图层信息')
          }
        }
      } else if (type === 'overlay:onmouseleft') {
        properties = value.getProperties()
      }
      return this.clearObject(type, properties)
    },

    /**
     * 去除不相关键值
     * @param type
     * @param object
     * @returns {*}
     */
    clearObject (type, object) {
      isClearObject.forEach(key => {
        if (object.hasOwnProperty(key)) {
          delete object[key]
        }
      })
      return object
    }
  }
}
