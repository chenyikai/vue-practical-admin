import EventEmitter from "eventemitter3";
import { cloneDeep } from "lodash";
import { mapConfig } from "plugins/mapConfig";

class Mapbox extends EventEmitter {
  map = null;
  ehhGis = new window.EhhGis();
  mapTimer = null;
  center = [122.106863, 30.216028];
  zoom = 9;

  init(options, callback) {
    window.map = this.map = new this.ehhGis.Map({
      center: this.center,
      zoom: this.zoom,
      ...cloneDeep(mapConfig),
      ...cloneDeep(options),
    });

    this.map.on("load", () => {
      callback &&
        callback({
          map: this.map,
          ehhGis: this.ehhGis,
        });
    });
  }

  destroy() {
    this.map._controls.forEach((control) => this.map.removeControl(control));

    this.map && this.map.remove();
    this.map = null;

    this.mapTimer && clearInterval(this.mapTimer);
    this.mapTimer = null;
  }

  getInstances() {
    return {
      map: this.map,
      ehhGis: this.ehhGis,
    };
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

  getEhhGis() {
    return this.ehhGis;
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

  _addImages() {}

  mapLoaded() {
    const load = (resolve) => {
      if (!this.map?._loaded) {
        if (!this.mapTimer) {
          this.mapTimer = setInterval(() => {
            load(resolve);
          }, 16);
        }
      } else {
        this.mapTimer && clearInterval(this.mapTimer);
        this.mapTimer = null;
        resolve();
      }
    };
    return new Promise((resolve, reject) => {
      try {
        load(resolve);
      } catch {
        this.mapTimer && clearInterval(this.mapTimer);
        this.mapTimer = null;
        reject();
      }
    });
  }
}

export default new Mapbox();
