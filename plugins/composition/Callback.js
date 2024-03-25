import { set } from "lodash";
import { validatenull } from "@/util/validate";

class Callback {
  static CLICK = "click";

  static instance = null;

  eventList = {};
  openFn = [];

  constructor(map) {
    this.map = map;
    this.clickFn = this._click.bind(this);

    this.init();
  }

  static getInstance(map) {
    if (validatenull(Callback.instance)) {
      Callback.instance = new Callback(map);
    }
    return Callback.instance;
  }

  init() {
    this.map.on(Callback.CLICK, this.clickFn);
  }

  destroy() {
    this.map.off(Callback.CLICK, this.clickFn);
  }

  addEventListener(event, id, fn) {
    set(this.eventList, id, {
      event,
      fn,
    });
  }

  removeEventListener(id) {
    delete this.eventList[id];
  }

  on(id, event) {
    if (!this.openFn.includes(id)) {
      this.openFn.push({
        id,
        event,
      });
    }
  }

  off(id) {
    const index = this.openFn.findIndex((item) => item.id === id);
    this.openFn.splice(index, 1);
  }

  _click() {
    if (this.openFn.map(({ event }) => event).includes(Callback.CLICK)) return;

    this.openFn.forEach((id) => {
      const { event, fn } = this.eventList[id];
      event === Callback.CLICK && fn();
    });
  }
}

export default Callback;
