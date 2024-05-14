import EventEmitter from "eventemitter3";

class MapboxSwitch extends EventEmitter {
  map = null;
  switch = null;

  setData({ map, mapSwitch }) {
    this.map = map;
    this.switch = mapSwitch;
  }

  switchLayer(name) {
    this.switch.switchLayer(name);
  }
}

export default MapboxSwitch;
