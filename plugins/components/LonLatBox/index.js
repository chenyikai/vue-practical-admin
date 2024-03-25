import EventEmitter from "eventemitter3";
import LonLatBoxVue from "./src";
import Vue from "vue";
const lonLatBoxElement = Vue.extend(LonLatBoxVue);

class LonLatBox extends EventEmitter {
  container = null;

  confirmFunc = this._confirm.bind(this);
  cancelFunc = this._cancel.bind(this);
  changeFunc = this._change.bind(this);
  addTeamFunc = this._add.bind(this);
  positionFunc = this._position.bind(this);

  constructor() {
    super();
    this.control = new lonLatBoxElement();
    this.control.$mount();
    this.control.$on("confirm", this.confirmFunc);
    this.control.$on("cancel", this.cancelFunc);
    this.control.$on("change", this.changeFunc);
    this.control.$on("addTeam", this.addTeamFunc);
    this.control.$on("position", this.positionFunc);
    this.container = this.control.$el;
  }

  destroy() {
    this.control.$off("confirm", this.confirmFunc);
    this.control.$off("cancel", this.cancelFunc);
    this.control.$off("change", this.changeFunc);
    this.control.$off("addTeam", this.addTeamFunc);
    this.control.$off("position", this.positionFunc);

    this.close();
  }

  getContainer() {
    return this.container;
  }

  open(data) {
    this.control.open(data);
  }

  setTeam(val) {
    this.control.setTeam(val);
  }

  close() {
    this.control.close();
  }

  isOpen() {
    return this.control.visible;
  }

  _confirm(val) {
    this.emit("confirm", val);
  }

  _cancel(val) {
    this.emit("cancel", val);
  }

  _change(val) {
    this.emit("change", val);
  }

  _add(val) {
    this.emit("addTeam", val);
  }

  _position(val) {
    this.emit("position", val);
  }
}

export default LonLatBox;
