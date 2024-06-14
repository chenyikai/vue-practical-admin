import EventEmitter from "eventemitter3";

class MapboxSwitch extends EventEmitter {
  map = null;
  switch = null;

  constructor(options) {
    super();
    this.map = options.map;
    this.switch = options.mapSwitch;
  }

  switchLayer(name) {
    this.switch.switchLayer(name);
  }
}

export default MapboxSwitch;
