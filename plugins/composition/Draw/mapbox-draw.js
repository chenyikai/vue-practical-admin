import EventEmitter from "eventemitter3";
import { set } from "lodash";
import { validatenull } from "@/utils/validate.js";
import { area, featureCollection } from "@turf/turf";

class MapboxDraw extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;
  /**
   *
   * @type {MapboxGlDraw}
   */
  draw = null;
  ehhGis = null;
  graphicalData = {};

  createFunc = this._createFunc.bind(this);
  updateFunc = this._updateFunc.bind(this);
  clickFunc = this._clickFunc.bind(this);
  selectionchangeFunc = this._selectionchangeFunc.bind(this);

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

  constructor({ map, draw, ehhGis }) {
    super();

    this.map = map;
    this.draw = draw;
    this.ehhGis = ehhGis;
  }

  getDraw() {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    return this.draw;
  }

  init() {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    this._initEvent();
  }

  destroy() {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    this._destroyEvent();

    this.map = null;
    this.draw = null;
    this.ehhGis = null;
    this.graphicalData = {};
  }

  changeMode(mode, options) {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    this.draw.changeMode(mode, options);
  }

  selectGraphical(id) {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    this.draw.select(id);
  }

  _initEvent() {
    this.map.on("draw.create", this.createFunc);
    this.map.on("draw.update", this.updateFunc);
    this.map.on("draw.clickOnFeature", this.clickFunc);
    this.map.on("draw.selectionchange", this.selectionchangeFunc);
  }

  _destroyEvent() {
    this.map.off("draw.create", this.createFunc);
    this.map.off("draw.update", this.updateFunc);
    this.map.off("draw.clickOnFeature", this.clickFunc);
    this.map.off("draw.selectionchange", this.selectionchangeFunc);
  }

  _isInit() {
    return this.draw && this.map;
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

  setGraphicalData(data) {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    if (Array.isArray(data)) {
      data.forEach((item) => {
        set(this.graphicalData, item.id, item);
      });
      return;
    }
    set(this.graphicalData, data.id, data);
  }

  updateGraphicalData(data) {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    this.setGraphicalData(data);
    const collection = [];
    for (const key in this.graphicalData) {
      collection.push(this.graphicalData[key]);
    }
    this.draw.set({
      type: "FeatureCollection",
      features: this._sort(collection),
    });
    const { properties } = this.graphicalData[data.id];
    for (const key in properties) {
      const value = properties[key];
      this.draw.setFeatureProperty(data.id, key, value);
    }
    this.draw.render();
  }

  render() {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    const list = [];
    for (const key in this.graphicalData) {
      list.push(this.graphicalData[key]);
    }
    this.draw.add(featureCollection(this._sort(list)));
  }

  _sort(val) {
    let point = [];
    let line = [];
    let polygon = [];
    val.forEach((item) => {
      const type = item.geometry.type;
      if (type === MapboxDraw.POINT) {
        point.push(item);
      } else if (type === MapboxDraw.LINE) {
        line.push(item);
      } else if (type === MapboxDraw.POLYGON) {
        polygon.push(item);
      }
    });
    polygon.sort((a, b) => {
      return area(b) - area(a);
    });
    return [...polygon, ...line, ...point];
  }

  clearGraphicalData(id) {
    if (!this._isInit()) {
      console.error("未初始化");
      return;
    }
    if (validatenull(id)) {
      this.draw.deleteAll();
      return;
    }
    this.draw.delete(id);
    delete this.graphicalData[id];
  }
}

export default MapboxDraw;
