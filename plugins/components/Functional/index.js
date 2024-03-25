import EventEmitter from "eventemitter3";
import Vue from "vue";
import FunctionalVue from "./src";
const FunctionalElement = Vue.extend(FunctionalVue);
import store from "@/store";

class Functional extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  mapLoadedInterval = null;

  container = null;
  constructor() {
    super();
    this.control = new FunctionalElement({ store });
    this.control.$mount();
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
}

export default Functional;
