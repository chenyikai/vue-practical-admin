import EventEmitter from "eventemitter3";
import { point } from "@turf/turf";

const size = 200;
const SOURCE = "alarm";
const POINT_LAYER = "alarm-point";

class MapboxAlarm extends EventEmitter {
  map = [];
  ehhGis = [];
  list = [];
  alarmData = {};
  alarmPointImg = null;
  clickFUnc = this._click.bind(this);

  setAlarm(alarmData) {
    this.list = this.uniqueData("mmsi", this._sort(alarmData));
  }

  addSource() {
    this.map.addImage("alarmPointImg", this.alarmPointImg, { pixelRatio: 2 });

    this.map.addSource(SOURCE, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addLayer({
      id: POINT_LAYER,
      type: "symbol",
      source: SOURCE,
      layout: {
        "icon-image": "alarmPointImg",
        "icon-allow-overlap": true,
      },
    });
  }

  getLayerId() {
    return POINT_LAYER;
  }

  removeSource() {
    this.map.removeLayer(POINT_LAYER);

    this.map.removeSource(SOURCE);
  }

  addEvents() {
    this.map.on("click", POINT_LAYER, this.clickFUnc);
  }

  removeEvents() {
    this.map.off("click", POINT_LAYER, this.clickFUnc);
  }

  destroy() {
    this.removeEvents();
    this.removeSource();
    this.alarmData = {};
  }

  setData({ map, ehhGis }) {
    this.map = map;
    this.ehhGis = ehhGis;

    const self = this;
    this.alarmPointImg = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      // When the layer is added to the map,
      // get the rendering context for the map canvas.
      onAdd: function () {
        const canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
      },

      // Call once before every frame where the icon will be used.
      render: function () {
        const duration = 1000;
        const t = (performance.now() % duration) / duration;

        const radius = (size / 2) * 0.3;
        const outerRadius = (size / 2) * 0.7 * t + radius;
        const context = this.context;

        // Draw the outer circle.
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
          this.width / 2,
          this.height / 2,
          outerRadius,
          0,
          Math.PI * 2
        );
        context.fillStyle = `rgba(255, 0, 0, ${1 - t})`;
        context.fill();

        // Draw the inner circle.
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 0, 0, 1)";
        context.fill();

        this.data = context.getImageData(0, 0, this.width, this.height).data;

        self.map.triggerRepaint();

        return true;
      },
    };

    this.addSource();
    this.addEvents();
  }

  uniqueData(key, v) {
    const shipMap = new Map();
    v.filter((item) => !shipMap.has(item[key]) && shipMap.set(item[key], item));
    return Array.from(shipMap.values());
  }

  _sort(val) {
    return val
      .map((item) => {
        return {
          ...item,
          doingTime: new Date(item.doingTime || Date.now()).getTime(),
        };
      })
      .sort((a, b) => {
        return b - a;
      });
  }

  show() {
    this.map.setLayoutProperty(POINT_LAYER, "visibility", "visible");
    const features = this.list.map((item) => point([item.lon, item.lat], item));
    this.map.getSource(SOURCE).setData({
      type: "FeatureCollection",
      features,
    });
  }

  _click(e) {
    const data = e.features[0].properties;
    this.emit("click", data);
  }

  hide() {
    this.map.setLayoutProperty(POINT_LAYER, "visibility", "none");
  }
}

export default new MapboxAlarm();
