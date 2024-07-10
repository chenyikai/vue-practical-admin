import Store from "../store";
import { point } from "@turf/turf";
import { set } from "lodash";
import * as styles from "../config/styles.js";

class Point {
  static FEATURE_TYPE = "point";
  mouseMoveFunc = null;
  clickFunc = null;
  uuid = null;
  plotList = {};

  constructor() {
    this.init();
  }

  init() {
    this.mouseMoveFunc = this._mouseMove.bind(this);
    this.clickFunc = this._click.bind(this);
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
    Store.getMap().once("click", this.clickFunc);
  }

  finish() {
    Store.getMap().off("mousemove", this.mouseMoveFunc);
  }

  initModifyEvent() {}

  destroyModifyEvent() {}

  _mouseMove(e) {
    const lonLat = [e.lngLat.lng, e.lngLat.lat];

    const feature = point(
      lonLat,
      {
        feature_type: Point.FEATURE_TYPE,
      },
      {
        id: this.uuid,
      },
    );

    console.log(feature);
    // Store.setFeature(feature);
    // Store.render(styles.COLD);
  }

  _click(e) {
    console.log(e, "click");
    this.finish();
  }
}

export default Point;
