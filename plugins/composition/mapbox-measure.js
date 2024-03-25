import EventEmitter from "eventemitter3";

// 创建测量的类
class MapboxMeasure extends EventEmitter {
  map = null;
  measure = null;

  setData({ map, mapMeasure }) {
    this.map = map;
    this.measure = mapMeasure;
  }

  destroy() {
    this.closeAll();
    this.measure.clear();
  }

  measureLayer(name) {
    this.measure[name].start();
  }
  closeAll() {
    this.measure.area.stop();
    this.measure.distance.stop();
    this.measure.position.stop();
  }
}

export default new MapboxMeasure();
