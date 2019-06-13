var config = {
  service: {
  },
  mapConfig: {
    controls: {
      attribution: false,
      geolocation: false,
      fullScreen: false,
      mousePosition: false,
      zoomSlider: false,
      zoomToExtent: false,
      rotate: false,
      zoom: false,
      scaleLine: false,
      loading: true
    },
    view: {
      center: [12114566.857708992, 4037839.9360650205],
      projection: 'EPSG:3857',
      zoom: 5
    },
    baseLayers: [
      {
        layerName: 'ditu',
        isDefault: true,
        layerType: 'GaoDe',
        attribution: {
          url: 'https://aurorafe.github.io',
          title: '恒达时讯',
          messages: '版权所有'
        },
        layerUrl: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'
      },
      {
        layerName: 'yaogan',
        isDefault: false,
        layerType: 'Google',
        layerUrl: 'http://www.google.cn/maps/vt?lyrs=s@803&gl=cn&x={x}&y={y}&z={z}'
      }
    ]
  },
  layerConfig: {
    jieyi: {
      layerName: 'jieyi',
      layerType: 'TileWMS',
      layerUrl: 'http://60.247.54.34:20000/geoserver/gwc/service/wms',
      url: 'http://60.247.54.34:20000/geoserver/gwc/service/wmts',
      layers: 'jieyi:appcountry',
      styles: '',
      version: '1.1.0',
      projection: 'EPSG:4326',
      srs: 'EPSG:4326',
      tiled: true,
      addLayer: true,
      opacity: 0.7,
      create: true,
      format: 'image/png',
      zIndex: 1
    },
    qgsyd: {
      layerName: 'qgsyd',
      isDefault: false,
      layerType: 'TileWMS',
      layerUrl: 'http://60.247.54.34:20000/geoserver/wms',
      layers: 'waterboundary',
      styles: '',
      projection: 'EPSG:3857',
      srs: 'EPSG:4326',
      version: '1.1.1',
      bbox: '74.8811340332031,18.1723747253418,132.408950805664,52.5199813842773',
      tiled: true,
      addLayer: true,
      create: true,
      opacity: 0.7,
      cql_filter: '1=1',
      zIndex: 2
    },
    water: {
      layerName: 'water',
      isDefault: false,
      layerType: 'TileWMS',
      layerUrl: 'http://60.247.54.34:20000/geoserver/watersys/wms',
      layers: 'watersys:tb_water_source_check', // tb_water_source_check
      styles: '',
      projection: 'EPSG:3857',
      srs: 'EPSG:4326',
      bbox: '79.92441218557393,18.344250404232827,131.63323891374492,50.40780675038131',
      tiled: true,
      addLayer: true,
      create: true,
      cql_filter: '1=1',
      zIndex: 3
    },
    baohuqubianjiexianLayer: {
      layers: 'watersys',
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'watersys:baohuqubianjiexian',
      maxFeatures: 50
    }
  },
  Maps: {},
  UserInfo: {},
  storageKey: {
    userToken: 'userToken_system',
    userInfo: 'userInfo_system'
  },
  storageKey: {
    userToken: 'userToken_system',
    userInfo: 'userInfo_system'
  },
  statisticsUrl: 'http://211.101.37.227:8075/',
  // baseUrlcs3: 'http://60.247.54.34:11001/',
  // baseUrlcs1: 'http://192.168.1.183:8511/',
  baseUrlcs1: 'http://192.168.0.181:8511/',
  baseUrlcs: 'http://192.168.1.183:9913/',
  appUrl: {
    waterSorceSystem: 'http://60.247.54.34:8220/water-source-system/index.html#'
  },
  // geoServer: 'http://60.247.54.34:8862/hdmapserver/QGSYDMAP/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=QGSYDMAP:baohuqubianjiexian&maxFeatures=50&outputFormat=json',
  regeocoder: 'http://restapi.amap.com/v3/geocode/regeo', // 高德api逆地址编码
  gaodeApiKey: 'ec35ffe2527ee5129d7d86884ab2c91e', // 高德apikey
}
