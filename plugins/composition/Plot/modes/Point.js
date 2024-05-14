import Store from "../store";
import { point } from "@turf/turf";
import * as styles from "../config/styles.js";

class Point {
  static FEATURE_TYPE = "point";
  mouseMoveFunc = null;

  constructor() {
    this.init();
  }

  init() {
    this.mouseMoveFunc = this._mouseMove.bind(this);
  }

  start() {
    Store.getMap().on("mousemove", this.mouseMoveFunc);
  }

  _mouseMove(e) {
    const lonLat = [e.lngLat.lng, e.lngLat.lat];
    const feature = point(lonLat, {});

    Store.setFeature(feature);
    Store.render(styles.COLD);
  }
}

export default Point;
