import LonLatBox from "../components/LonLatBox";
import { polygon, centerOfMass, bbox } from "@turf/turf";
import MapboxDraw, { MapboxDrawClass } from "./Draw/mapbox-draw.js";
import EventEmitter from "eventemitter3";
import Mapbox from "@/plugins/composition/mapbox";

class MapboxPlot extends EventEmitter {
  boxEvent = {};
  teamList = [];
  config = {};

  static POINT = "Point";
  static LINE = "LineString";
  static POLYGON = "Polygon";
  static CIRCLE = "Circle";

  createFunc = this._create.bind(this);
  updateFunc = this._update.bind(this);
  clickFunc = this._click.bind(this);
  changeFunc = this._change.bind(this);

  setTeam(team) {
    this.teamList = team;
  }

  start(mode, options) {
    MapboxDraw.changeMode(mode, options);
  }

  init() {
    MapboxDraw.on("graphical_create", this.createFunc);
    MapboxDraw.on("graphical_update", this.updateFunc);
    MapboxDraw.on("graphical_click", this.clickFunc);
    MapboxDraw.on("graphical_selectionchange", this.changeFunc);
    this._initBox();
  }

  destroy() {
    MapboxDraw.off("graphical_create", this.createFunc);
    MapboxDraw.off("graphical_update", this.updateFunc);
    MapboxDraw.off("graphical_click", this.clickFunc);
    MapboxDraw.off("graphical_selectionchange", this.changeFunc);

    this.teamList = [];

    this._destroyBox();
  }

  delete(id) {
    MapboxDraw.clearGraphicalData(id);
  }

  update(val) {
    MapboxDraw.updateGraphicalData(val);
  }

  position(feature) {
    MapboxDraw.changeMode(MapboxDrawClass.SIMPLE_SELECT);
    Mapbox.getMap().fitBounds(bbox(feature), {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
  }

  isPlot(type) {
    return [
      MapboxPlot.POINT,
      MapboxPlot.LINE,
      MapboxPlot.POLYGON,
      MapboxPlot.CIRCLE,
    ].includes(type);
  }

  _openDrawer(data) {
    this.lonLatBox.open(data);
    this.lonLatBox.setTeam(this.teamList);
  }

  _initBox() {
    this.lonLatBox = new LonLatBox();

    const confirm = (val) => this.emit("confirm", val);
    const addTeam = (val) => this.emit("addTeam", val);
    const cancel = (val) => this.emit("cancel", val);
    const change = (val) => MapboxDraw.updateGraphicalData(val);
    const position = (val) => this.position(val);

    this.lonLatBox.on("confirm", confirm);
    this.lonLatBox.on("addTeam", addTeam);
    this.lonLatBox.on("cancel", cancel);
    this.lonLatBox.on("change", change);
    this.lonLatBox.on("position", position);

    this.boxEvent = {
      confirm,
      addTeam,
      cancel,
      change,
      position,
    };
  }

  _destroyBox() {
    for (const key in this.boxEvent) {
      this.lonLatBox.off(key, this.boxEvent[key]);
    }
    this.lonLatBox.destroy();

    this.boxEvent = {};
    this.lonLatBox = null;
  }

  getCenter(geometry) {
    if (MapboxPlot.POINT === geometry.type) {
      return geometry.coordinates;
    } else if (
      MapboxPlot.LINE === geometry.type ||
      "MultiPoint" === geometry.type
    ) {
      const _length = geometry.coordinates.length;
      return geometry.coordinates[_length - 1];
    } else if (MapboxPlot.POLYGON) {
      const center = centerOfMass(polygon(geometry.coordinates));
      return center.geometry.coordinates;
    } else {
      return [0, 0];
    }
  }

  edit(data) {
    this._openDrawer(data);
  }

  _create(e) {
    if (e.features.length === 0) return;
    const { properties } = e.features[0];
    if (this.isPlot(properties["graphical-type"])) {
      const data = e.features[0];
      MapboxDraw.setGraphicalData(data);
      this._openDrawer(data);

      setTimeout(() => {
        const id = data.id;
        MapboxDraw.selectGraphical(id);
      }, 0);
    }
  }

  _update(e) {
    if (e.features.length === 0) return;
    const { properties } = e.features[0];
    if (this.isPlot(properties["graphical-type"])) {
      const data = e.features[0];
      // MapboxDraw.setGraphicalData(data);
      this._openDrawer(data);
    }
  }

  _click(e) {
    const { properties } = e.feature;
    if (this.isPlot(properties["graphical-type"])) {
      const id = e.feature.id;
      MapboxDraw.selectGraphical(id);
      this._openDrawer(e.feature);
    }
  }

  _change(e) {
    if (e.features.length === 0) return;
    const { properties } = e.features[0];
    if (this.isPlot(properties["graphical-type"])) {
      const data = e.features[0];
      this._openDrawer(data);
    }
  }
}

export default new MapboxPlot();
export { MapboxPlot as MapboxPlotClass };
