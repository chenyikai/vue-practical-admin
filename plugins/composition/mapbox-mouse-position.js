import EventEmitter from "eventemitter3";
import { debounce } from "lodash";

class MapboxMousePosition extends EventEmitter {
  map = null;
  moveFunc = debounce((val) => {
    this._move(val);
  }, 10);
  setData({ map }) {
    this.map = map;
  }

  init() {
    this.map.on("mousemove", this.moveFunc);
  }

  destroy() {
    this.map.off("mousemove", this.moveFunc);
  }

  _move(e) {
    this.emit("move", e.lngLat);
  }
}

export default new MapboxMousePosition();
