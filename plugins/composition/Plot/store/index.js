import EventEmitter from "eventemitter3";
import { featureCollection } from "@turf/turf";
import * as styles from "../config/styles.js";

let mapTimer = null;

class Store extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  features = [];

  setData(map) {
    this.map = map;
  }

  getMap() {
    return this.map;
  }

  getUUid() {
    return Date.now();
  }

  setFeature(feature) {
    this.features.push(feature);
  }

  render(type) {
    const collection = featureCollection(this.features);
    const source =
      type === styles.COLD ? styles.SOURCES.COLD : styles.SOURCES.HOT;

    this.getMap().getSource(source).setData(collection);
  }

  loaded() {
    const load = (resolve) => {
      if (!this.getMap()?._loaded) {
        if (!mapTimer) {
          mapTimer = setInterval(() => {
            load(resolve);
          }, 16);
        }
      } else {
        mapTimer && clearInterval(mapTimer);
        mapTimer = null;
        resolve();
      }
    };

    return new Promise((resolve, reject) => {
      try {
        load(resolve);
      } catch {
        mapTimer && clearInterval(mapTimer);
        mapTimer = null;
        reject();
      }
    });
  }

  /**
   * 判断是否为空
   */
  isNull(val) {
    if (["boolean", "number"].includes(typeof val)) {
      return false;
    } else if (val instanceof Array) {
      return val.length === 0;
    } else if (val instanceof Object) {
      return JSON.stringify(val) === "{}";
    } else {
      return ["null", null, undefined, "undefined", ""].includes(val);
    }
  }
}

export default new Store();
