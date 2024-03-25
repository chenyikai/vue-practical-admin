import EventEmitter from "eventemitter3";
import EhhRouteDraw from "@/plugins/composition/ehhRouteDraw/index";

class MapboxRouteDraw extends EventEmitter {
  map = null;
  routeDraw = null;

  createFunc = this._create.bind(this);
  updateFunc = this._update.bind(this);
  setData({ map }) {
    this.map = map;
    this.routeDraw = new EhhRouteDraw({});
    this.map.addControl(this.routeDraw);
  }

  init() {
    this.map.on("route.create", this.createFunc);
    this.map.on("ehhRouteDraw.update", this.updateFunc);
  }

  destroy() {
    this.map.off("route.create", this.createFunc);
    this.map.off("ehhRouteDraw.update", this.updateFunc);
  }

  start() {
    this.routeDraw.start();
  }

  end() {
    this.routeDraw.changeMode("static");
  }

  _create(e) {
    console.log(e, "e");
  }

  _update(e) {
    console.log(e, "e");
  }

  setRouteData(featureCollection) {
    this.routeDraw.set(featureCollection);
  }
}

export default new MapboxRouteDraw();
