import Store from "../store";
import { point } from "@turf/turf";
import { set } from "lodash";
import * as styles from "../config/styles.js";

class Point {
  static FEATURE_TYPE = "point";
  mouseMoveFunc = null;
  uuid = null;
  plotList = {};

  constructor() {
    this.init();
  }

  init() {
    this.mouseMoveFunc = this._mouseMove.bind(this);
  }

  destroy() {
    this.destroyModifyEvent();
    this.uuid = null;
    this.plotList = {};
  }

  begin() {
    this.uuid = Store.getUUid();
    set(this.plotList, this.uuid, {});

    Store.getMap().on("mousemove", this.mouseMoveFunc);
    Store.getMap().once("click", this.mouseMoveFunc);
  }

  finish() {
    Store.getMap().off("mousemove", this.mouseMoveFunc);
  }

  initModifyEvent() {}

  destroyModifyEvent() {}

  _mouseMove(e) {
    const lonLat = [e.lngLat.lng, e.lngLat.lat];
    const feature = point(lonLat, {});

    Store.setFeature({ id: this.uuid, ...feature });
    Store.render(styles.COLD);
  }
}

export default Point;
