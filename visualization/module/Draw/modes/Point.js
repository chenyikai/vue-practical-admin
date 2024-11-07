import Store from "../store";
import { set } from "lodash";
import Plot from "./Plot.js";
import Acme from "../core/Acme.js";

class Point extends Plot {
  static TYPE = "Point";
  mouseMoveFunc = null;
  clickFunc = null;

  uuid = null;
  properties = {};

  plotList = {};

  constructor() {
    super();
    this.addEvents();
  }

  _init(properties) {
    this.uuid = Store.getUUid();
    this.properties = properties;
  }

  _reset() {
    this.uuid = "";
    this.properties = {};
  }

  addEvents() {
    this.mouseMoveFunc = this._mouseMove.bind(this);
    this.clickFunc = this._click.bind(this);
  }

  destroy() {
    this.destroyModifyEvent();
    this.uuid = null;
    this.plotList = {};
  }

  begin(properties) {
    this._init(properties);

    set(this.plotList, this.uuid, {
      plot: null,
      acme: [],
      isFinish: false,
    });

    Store.getMap().on("mousemove", this.mouseMoveFunc);
    Store.getMap().once("click", this.clickFunc);
  }

  update(uuid, options) {
    const acme = this.getPlot(this.uuid);
    acme.update(options);
  }

  finish() {
    Store.getMap().off("mousemove", this.mouseMoveFunc);
  }

  initModifyEvent() {}

  destroyModifyEvent() {}

  _mouseMove(e) {
    if (this.isUpdate(this.uuid)) {
      this.update(this.uuid, { lonLat: e.lngLat });
    } else {
      const point = new Acme(e.lngLat, this.properties, { id: this.uuid });
      set(this.plotList, this.uuid, {
        plot: point.getFeature(),
        acme: [point],
        isFinish: false,
      });
    }

    const feature = this.getPlot(this.uuid).getFeature();
    console.log(feature);
  }

  _click(e) {
    this.update(this.uuid, { lonLat: e.lngLat });
    this._reset();
    this.finish();
  }

  getPlot(uuid) {
    return this.plotList[uuid].plot;
  }

  isUpdate(uuid) {
    return Object.keys(this.plotList).includes(uuid);
  }
}

export default Point;
