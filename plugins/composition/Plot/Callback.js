import { set } from "lodash";
import Store from "./store";

class Callback {
  static CLICK = "click";
  static MOUSE_MOVE = "mousemove";

  eventList = {};
  openFn = [];

  constructor() {
    this.clickFn = this._click.bind(this);
    this.mouseMoveFn = this._mouseMove.bind(this);

    this.init();
  }

  init() {
    Store.getMap().on(Callback.CLICK, this.clickFn);
  }

  destroy() {
    Store.getMap().off(Callback.CLICK, this.clickFn);
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
    this.trigger(Callback.CLICK);
  }

  _mouseMove() {
    this.trigger(Callback.MOUSE_MOVE);
  }

  isTrigger(name) {
    return this.openFn.map(({ event }) => event).includes(name);
  }

  trigger(name) {
    if (!this.isTrigger(name)) return;

    this.openFn.forEach((id) => {
      const { event, fn } = this.eventList[id];
      event === name && fn();
    });
  }
}

export default Callback;
