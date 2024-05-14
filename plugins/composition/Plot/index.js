import * as vars from "./config/vars.js";
import Store from "./store";
import * as styles from "./config/styles.js";
import Point from "plugins/composition/Plot/modes/Point.js";

class Plot {
  static POINT = "Point";
  static LINE = "LineString";
  static POLYGON = "Polygon";

  static SIMPLE_SELECT = "simple_select";
  static DIRECT_SELECT = "direct_select";
  static DRAW_POINT = "draw_point";
  static DRAW_CUSTOM_POINT = "draw_custom_point";
  static DRAW_TEXT = "draw_text";
  static DRAW_LINE_STRING = "draw_line_string";
  static DRAW_ARROW = "draw_arrow";
  static DRAW_CIRCLE = "draw_circle";
  static DRAW_RECTANGLE = "draw_rectangle";
  static DRAW_POLYGON = "draw_polygon";
  static DRAW_SECTOR = "draw_sector";

  constructor(options) {
    Store.setData(options.map);

    Store.loaded().then(() => {
      this._init();
    });
  }

  /**
   *
   * @param {string} mode 模式
   * @param {object}options
   */
  start(mode, options) {
    console.log(mode, options, "mode, options");
    const point = new Point();
    point.start();
  }

  /**
   * 删除
   */
  delete() {
    this.map.fire(vars.DELETE);
  }

  /**
   * 添加或修改
   */
  set() {}

  /**
   * 查询
   */
  get() {}

  /**
   * 选择
   */
  select() {
    this.map.fire(vars.SELECTION_CHANGE);
  }

  /**
   * 渲染
   */
  render() {
    this.map.fire(vars.RENDER);
  }

  /**
   *
   * @private
   */
  _init() {
    Store.getMap().addSource(styles.SOURCES.HOT, {
      type: "geojson",
      data: vars.EMPTY_COLLECTION,
    });

    Store.getMap().addSource(styles.SOURCES.COLD, {
      type: "geojson",
      data: vars.EMPTY_COLLECTION,
    });

    styles.HOT_LAYER.forEach((layer) => {
      if (!Store.getMap().getLayer(layer.id)) {
        Store.getMap().addLayer({ ...layer, source: styles.SOURCES.HOT });
      }
    });

    styles.COLD_LAYER.forEach((layer) => {
      if (!Store.getMap().getLayer(layer.id)) {
        Store.getMap().addLayer({ ...layer, source: styles.SOURCES.COLD });
      }
    });
  }

  _addIcons(icons) {
    for (const name in icons) {
      const icon = icons[name];
      Store.getMap().loadImage(icon, (error, result) => {
        if (error) throw error;
        if (!Store.getMap().hasImage(name)) {
          Store.getMap().addImage(name, result);
        }
      });
    }
  }

  destroy() {
    [...styles.HOT_LAYER, ...styles.COLD_LAYER].forEach((layer) => {
      if (Store.getMap().getLayer(layer.id)) {
        Store.getMap().removeLayer(layer.id);
      }
    });

    [styles.SOURCES.HOT, styles.SOURCES.COLD].forEach((source) => {
      if (Store.getMap().getSource(source)) {
        Store.getMap().removeSource(source);
      }
    });
  }
}

export default Plot;
