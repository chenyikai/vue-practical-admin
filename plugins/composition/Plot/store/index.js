import EventEmitter from "eventemitter3";
import { featureCollection } from "@turf/turf";
import * as styles from "../config/styles.js";
import * as vars from "../config/vars.js";
import { set } from "lodash";

let mapTimer = null;

class Store extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  /**
   *
   * @type {null}
   */
  point = null;

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
    const i = this.getFeatureIndex(feature.id);
    if (i === -1) {
      this.features.push(feature);
    } else {
      set(this.features, i, feature);
    }
  }

  deleteFeature(feature) {
    const i = this.getFeatureIndex(feature.id);
    if (i !== -1) {
      return this.features.splice(i, 1);
    }
  }

  getFeature(id) {
    return this.feature.find((item) => item.id === id);
  }

  getFeatureIndex(id) {
    return this.feature.findIndex((item) => item.id === id);
  }

  /**
   *
   * @param {Feature} feature1
   * @param {Feature} feature2
   */
  isSameFeature(feature1, feature2) {
    if (feature1.geometry.type !== feature2.geometry.type) return false;

    if (
      JSON.stringify(feature1.geometry.coordinates) !==
      JSON.stringify(feature2.geometry.coordinates)
    ) {
      return false;
    }

    for (const key in feature1.properties) {
      const value1 = feature1.properties[key];
      const value2 = feature2.properties[key];
    }
  }

  render(type) {
    const collection = featureCollection(this.features);
    const source =
      type === styles.COLD ? styles.SOURCES.COLD : styles.SOURCES.HOT;

    this.getMap().getSource(source).setData(collection);

    this.getMap().fire(vars.RENDER);
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
