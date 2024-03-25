import EventEmitter from "eventemitter3";
import MapboxDraw, { MapboxDrawClass } from "@/plugins/composition/mapbox-draw";
import LonLatBox from "@/plugins/components/LonLatBox";
import { set } from "lodash";
import Mapbox from "@/plugins/composition/mapbox";
import { bbox } from "@turf/turf";

class MapboxTools extends EventEmitter {
  static FENCE = "Fence";
  static STOP = "Stop";
  static PLAY_BACK = "PlayBack";
  static ROUTE = "Route";

  boxEvent = {};
  timeData = {};
  lonLatBox = null;

  createFunc = this._create.bind(this);
  updateFunc = this._update.bind(this);
  clickFunc = this._click.bind(this);
  changeFunc = this._change.bind(this);

  setTeam({ type, val }) {
    set(this.timeData, type, val);
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

    this._destroyBox();
  }

  start(mode, options) {
    MapboxDraw.changeMode(mode, options);
  }

  isTool(type) {
    return [
      MapboxTools.FENCE,
      MapboxTools.STOP,
      MapboxTools.PLAY_BACK,
      MapboxTools.ROUTE,
    ].includes(type);
  }

  edit(data) {
    MapboxDraw.setGraphicalData(data);
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

  _create(e) {
    if (e.features.length === 0) return;
    const { properties } = e.features[0];
    if (this.isTool(properties["graphical-type"])) {
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
    if (this.isTool(properties["graphical-type"])) {
      const data = e.features[0];
      MapboxDraw.setGraphicalData(data);
      this._openDrawer(data);
    }
  }

  _click(e) {
    const { properties } = e.feature;
    if (
      [MapboxTools.STOP, MapboxTools.PLAY_BACK, MapboxTools.ROUTE].includes(
        properties["graphical-type"]
      )
    ) {
      const id = e.feature.id;
      MapboxDraw.selectGraphical(id);
      this._openDrawer(e.feature);
    }
  }

  _change(e) {
    if (e.features.length === 0) return;
    const { properties } = e.features[0];
    if (this.isTool(properties["graphical-type"])) {
      const data = e.features[0];
      this._openDrawer(data);
    }
  }

  _openDrawer(data) {
    const { properties } = data;
    this.lonLatBox.open(data);
    this.lonLatBox.setTeam(this.timeData[properties["graphical-type"]]);
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
}

export default new MapboxTools();
export { MapboxTools as MapboxToolsClass };
