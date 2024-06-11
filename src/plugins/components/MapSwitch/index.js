import EventEmitter from "eventemitter3";
import Vue from "vue";
import MapSwitchVue from "../../../pages/Map/components/MapboxSwitch/index.vue";
const MapSwitchElement = Vue.extend(MapSwitchVue);

class MapSwitch extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  mapLoadedInterval = null;

  container = null;

  changeFunc = this._change.bind(this);
  constructor() {
    super();
    this.control = new MapSwitchElement();
    this.control.$mount();
    this.control.$on("change", this.changeFunc);
    this.container = this.control.$el;
  }

  onAdd(map) {
    this.map = map;
    this._connect = this.connect.bind(this);

    if (map.loaded()) {
      this._connect();
    } else {
      map.on("load", this._connect.bind(this));
      this.mapLoadedInterval = setInterval(() => {
        if (map.loaded()) this._connect();
      }, 16);
    }
    return this.container;
  }

  onRemove() {
    this.map.off("load", this._connect);
    this.mapLoadedInterval && clearInterval(this.mapLoadedInterval);
    this.mapLoadedInterval = null;

    this.control.$off("change", this.changeFunc);

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
    // this.timelineElement.$destory();
  }

  connect() {
    this.map.off("load", this._connect);
    this.mapLoadedInterval && clearInterval(this.mapLoadedInterval);
    this.mapLoadedInterval = null;
  }

  _change(val) {
    this.emit("change", val);
  }
}

export default MapSwitch;
