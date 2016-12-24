'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
  function Map() {
    _classCallCheck(this, Map);
  }

  _createClass(Map, [{
    key: 'getMapParams',
    value: function getMapParams(mapDiv, url) {
      var that = this;
      var promise = new Promise(function (resolve, reject) {
        $.ajax({
          url: url + '?f=pjson',
          type: 'GET',
          dataType: 'jsonp',
          jsonp: 'callback',
          success: function success(data) {
            if (data) {
              var res = {
                projection: data.spatialReference.wkid,
                fullExtent: [data.fullExtent.xmin, data.fullExtent.ymin, data.fullExtent.xmax, data.fullExtent.ymax],
                origin: [data.tileInfo.origin.x, data.tileInfo.origin.y],
                tileSize: data.tileInfo.cols,
                lods: data.tileInfo.lods,
                tileUrl: url
              };
              that.initMap(mapDiv, res);
              resolve(res);
            } else {
              reject(data);
            }
          }
        });
      });
      return promise;
    }
  }, {
    key: 'initMap',
    value: function initMap(mapDiv, params) {
      var options = params || {};
      var that = this;
      /**
       * 投影
       * @type {ol.proj.Projection}
       */
      this.projection = ol.proj.get('EPSG:' + options.projection);
      this.projection.setExtent([-180, -90, 180, 90]);
      /**
       * 显示范围
       */
      this.fullExtent = options.fullExtent;
      /**
       * 瓦片原点
       */
      this.origin = options.origin;
      /**
       * 瓦片大小
       */
      this.tileSize = options.tileSize;
      /**
       * 分辨率
       * @type {Array}
       */
      this.resolutions = [];
      var len = options.lods.length;
      for (var i = 0; i < len; i++) {
        this.resolutions.push(options.lods[i].resolution);
      }
      /**
       * 定义渲染参数
       */
      var size = ol.extent.getWidth(this.projection.getExtent()) / 256;
      /**
       * 渲染分辨率
       * @type {Array}
       * @private
       */
      this._resolutions = new Array(19);
      /**
       * 层级
       * @type {Array}
       */
      this.matrixIds = new Array(19);
      for (var z = 0; z < 19; ++z) {
        this._resolutions[z] = size / Math.pow(2, z);
        this.matrixIds[z] = z;
      }
      var tileUrl = options.tileUrl;
      var tileGrid = new ol.tilegrid.TileGrid({
        tileSize: that.tileSize,
        origin: that.origin,
        extent: that.fullExtent,
        resolutions: that.resolutions
      });
      var urlTemplate = tileUrl + '/tile/{z}/{y}/{x}';
      var tileArcGISXYZ = new ol.source.XYZ({
        wrapX: false,
        tileGrid: tileGrid,
        projection: that.projection,
        tileUrlFunction: function tileUrlFunction(tileCoord) {
          var url = urlTemplate.replace('{z}', tileCoord[0].toString()).replace('{x}', tileCoord[1].toString()).replace('{y}', (-tileCoord[2] - 1).toString());
          return url;
        }
      });
      var baseLayer = new ol.layer.Tile({
        isBaseLayer: true,
        isCurrentBaseLayer: true,
        layerName: config.layerConfig.baseLayers[0].layerName,
        source: tileArcGISXYZ
      });
      this.map = new ol.Map({
        target: mapDiv,
        interactions: ol.interaction.defaults({
          doubleClickZoom: true,
          keyboard: false
        }).extend([]),
        controls: [new ol.control.ScaleLine({
          target: 'hdscalebar'
        })],
        layers: [baseLayer],
        view: new ol.View({
          center: ol.proj.fromLonLat(config.mapConfig.center, that.projection),
          zoom: config.mapConfig.zoom,
          projection: that.projection,
          extent: that.fullExtent,
          maxResolution: that._resolutions[0],
          minResolution: that._resolutions[18]
        })
      });
    }
  }, {
    key: 'earthquakeSourceAni',
    value: function earthquakeSourceAni(point, params) {
      var that = this;
      var marker = document.createElement('div');
      marker.className = "earthquakeSourceCon";
      for (var i = 0; i < 4; i++) {
        var circle = document.createElement('div');
        circle.className = "earthCircle";
        marker.appendChild(circle);
      }
      var id = null,
          coordinate = [];
      if (point) {
        coordinate = point.geometry;
        id = point.id ? point.id : point.ID;
      }
      if (params.messages) {
        var massages = document.createElement('div');
        massages.className = 'earthMassages';
        var title = document.createElement('div');
        title.className = "earthMassages-title";
        var coorMsg = document.createElement('div');
        coorMsg.className = "earthMassages-coor";
        title.innerHTML = params.messages.title;
        coorMsg.innerHTML = params.messages.coorMsg;
        massages.appendChild(title);
        massages.appendChild(coorMsg);
        marker.appendChild(massages);
      }
      var iconOverlay = new ol.Overlay({
        element: marker,
        positioning: 'center-center',
        id: id,
        offset: [0, 0],
        stopEvent: true
      });
      //设置标识参数
      if (params) {
        iconOverlay.set("params", params);
        if (params.layerName) {
          iconOverlay.set("layerName", params.layerName);
        }
      }
      clearInterval(timer);
      var timer = setInterval(function () {
        if (that.map) {
          clearInterval(timer);
          iconOverlay.setPosition(coordinate);
          that.map.addOverlay(iconOverlay);
        }
      }, 500);
    }
  }]);

  return Map;
}();

exports.default = Map;