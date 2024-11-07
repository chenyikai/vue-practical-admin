import EventEmitter from "eventemitter3";
import { cloneDeep } from "lodash";
import { style } from "visualization/config.js";
import { Map } from "mapbox-gl";

const cache = new Set();

class Mapbox extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;
  mapTimer = null;
  center = [122.106863, 30.216028];
  zoom = 9;

  /**
   * 地图操作对象构造器
   * @constructor
   * @param options { MapboxOptions }
   * @callback cb
   */
  constructor(options, cb) {
    super();
    window.map = this.map = new Map({
      center: this.center,
      zoom: this.zoom,
      style,
      ...cloneDeep(options),
    });

    this.map.on("load", () => {
      cb && cb(this.getMap());
    });
  }

  destroy() {
    this.map._controls.forEach((control) => this.map.removeControl(control));

    this.map && this.map.remove();
    this.map = null;

    this.mapTimer && clearInterval(this.mapTimer);
    this.mapTimer = null;
  }

  aim() {
    this.map.setCenter(this.center);
    this.map.setZoom(this.zoom);
  }

  zoomIn() {
    if (!this.map.isZooming()) {
      this.map.zoomIn();
    }
  }

  zoomOut() {
    if (!this.map.isZooming()) {
      this.map.zoomOut();
    }
  }

  getMap() {
    return this.map;
  }

  addImage(data) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(data)) {
        data.forEach(({ url, name }) => {
          this.map.loadImage(url, (err, image) => {
            if (err) return reject(err);
            if (!this.map.hasImage(name)) {
              this.map.addImage(name, image);
            }
          });
        });
      } else {
        this.map.loadImage(data.url, (err, image) => {
          if (err) return reject(err);
          if (!this.map.hasImage(data.name)) {
            this.map.addImage(data.name, image);
          }
        });
      }
      resolve();
    });
  }

  /**
   *
   * @param { Array | Object } data
   * @param { String } data.source
   * @param { Array } data.features
   */
  setSource(data) {
    if (Array.isArray(data)) {
      data.forEach(({ source, features }) => {
        this.map.getSource(source).setData({
          type: "FeatureCollection",
          features,
        });
      });
    } else {
      this.map.getSource(data.source).setData({
        type: "FeatureCollection",
        features: data.features,
      });
    }
  }

  clearSource(data) {
    if (Array.isArray(data)) {
      data.forEach((item) => {
        this.map.getSource(item).setData({
          type: "FeatureCollection",
          features: [],
        });
      });
    } else {
      this.map.getSource(data).setData({
        type: "FeatureCollection",
        features: [],
      });
    }
  }

  isLoad() {
    const load = (resolve) => {
      if (!this.map?._loaded) {
        if (!this.mapTimer) {
          this.mapTimer = setInterval(() => {
            load(resolve);
          }, 16);
        } else {
          cache.add(resolve);
        }
      } else {
        this.mapTimer && clearInterval(this.mapTimer);
        this.mapTimer = null;
        if (cache.size > 0) {
          cache.forEach((cb) => cb());
          cache.clear();
        }
        resolve();
      }
    };
    return new Promise((resolve, reject) => {
      try {
        load(resolve);
      } catch (e) {
        this.mapTimer && clearInterval(this.mapTimer);
        this.mapTimer = null;
        reject(e);
      }
    });
  }
}

export default Mapbox;
