import MapboxDraw from "@/plugins/composition/mapbox-draw";
import { parse } from "wellknown";
import { circle, feature } from "@turf/turf";
import { validatenull } from "@/utils/validate.js";

class MapboxLayer extends MapboxDraw {
  map = null;
  ehhGis = null;

  static Port = "Port";
  static Warn = "Warn";
  static Anchorage = "Anchorage";
  static SPOT = "spot";

  static POINT_STYLE = {
    "graphical-type": null,
    "icon-image": "point", //图片名称  对应初始化时 icons中key
    "text-anchor": "top", //文字对齐方式
    "text-offset": [0, 0.5], //文字偏移量
    "icon-size": 1, //图标缩放倍数
    "text-color": "#000000", //文字颜色
    name: null, //点位名称
    "text-size": 14, //文字大小
    "text-halo-width": 1, //文字描边宽度
    "text-halo-color": "#FFFFFF", //文字描边颜色
  };

  static LINE_STYLE = {
    "graphical-type": null,
    name: null, //点位名称
    "text-anchor": "center", //文本对齐方式
    "symbol-placement": "point", //文本位置方式
    "line-width": 2, //线宽
    "text-color": "#FF0000", //文本颜色
    "line-color": "#e600ff", //线颜色
    "text-size": 14, //文本字体大小
    "text-halo-width": 1, //文本描边粗细
    "text-halo-color": "#FFFFFF", //文本描边颜色
    "text-offset": [0, 0], //文本位移
  };

  static POLYGON_STYLE = {
    "graphical-type": null,
    name: null, //点位名称
    "text-anchor": "center", //文本对齐方式
    "text-size": 14, //文本字体大小
    "line-width": 2, //线宽
    "text-halo-width": 1, //文本描边粗细
    "text-offset": [0, 0], //文本位移
    "text-color": "#FF0000", //文本颜色
    "line-color": "#e600ff", //线颜色
    "text-halo-color": "#FFFFFF", //文本描边颜色
    "fill-color": "#e600ff", //面填充色
    "fill-opacity": 0.1, //面透明度
  };

  clickFunc = this._click.bind(this);

  constructor(options) {
    super(options);

    this.map = options.map;
    this.ehhGis = options.ehhGis;
  }

  destroy() {
    super.destroy();
  }

  isLayer(type) {
    return [MapboxLayer.Port, MapboxLayer.Warn, MapboxLayer.Anchorage].includes(
      type,
    );
  }

  _createFunc(e) {
    this.emit("graphical_create", e);
  }

  _updateFunc(e) {
    this.emit("graphical_update", e);
  }

  _clickFunc(e) {
    this.emit("graphical_click", e);
  }

  _selectionchangeFunc(e) {
    this.emit("graphical_selectionchange", e);
  }

  render(val) {
    super.setGraphicalData(val);
    super.render();
  }

  clear() {
    super.clearGraphicalData();
    this.draw.deleteAll();
  }

  _click(e) {
    const { properties } = e.feature;
    if (this.isLayer(properties["graphical-type"])) {
      console.log(e);
    }
  }

  handleAllTypeLayer(data) {
    return data
      .map((item) => {
        if (item.geom) {
          let properties = {};
          let geom = parse(item.geom);
          if (geom["type"] === MapboxDraw.POINT && !item.radius) {
            console.log(item.icon, "icon");
            properties = {
              ...MapboxLayer.POINT_STYLE,
              "icon-image": item.icon || "point",
            };
          } else if (geom["type"] === MapboxDraw.LINE) {
            properties = MapboxLayer.LINE_STYLE;
          } else if (geom["type"] === MapboxDraw.POLYGON) {
            properties = MapboxLayer.POLYGON_STYLE;
          } else if (geom["type"] === MapboxDraw.POINT && item.radius) {
            properties = {
              ...MapboxLayer.CIRCLE_STYLE,
            };
          }

          let _feature = {};

          if (geom["type"] === MapboxDraw.POINT && item.radius) {
            _feature = circle(geom.coordinates, item.radius, {
              units: "kilometers",

              steps: 64,

              properties: properties,
            });
          } else {
            _feature = feature(geom, {
              ...properties,
              "graphical-type": MapboxLayer.Warn,
              name: item.name,
            });
          }

          return {
            id: item.id,

            ..._feature,
          };
        }
      })

      .filter((item) => !validatenull(item))

      .flat();
  }
}

export default MapboxLayer;
