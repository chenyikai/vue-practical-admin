import EventEmitter from "eventemitter3";
import { validatenull } from "@/util/validate";
import { formatLatitudeAndLongitude } from "@/util/util";
import { lineString, bbox } from "@turf/turf";
import Mapbox from "@/plugins/composition/mapbox";

class MapboxShipTrack extends EventEmitter {
  map = null;
  ehhGis = null;
  shipTrack = null;
  trackData = [];

  formConfig = [
    {
      prop: "position",
      label: "位置",
      format: ({ shipData }) => {
        const { lon, lat } = shipData;
        const { longitude, latitude } = formatLatitudeAndLongitude(lon, lat);
        return `${longitude.text} ${latitude.text}`;
      },
    },
    {
      prop: "formatTime",
      label: "更新时间",
    },
    {
      prop: "courseOverGround",
      label: "方向（度）",
    },
    {
      prop: "speedOverGround",
      label: "速度（节）",
    },
  ];

  moveFunc = this._move.bind(this);
  outFunc = this._out.bind(this);

  setData({ map, ehhGis, shipTrack }) {
    this.map = map;
    this.ehhGis = ehhGis;
    this.shipTrack = shipTrack;
  }

  init() {
    this._initEvent();
  }

  destroy() {
    this._removePopup();
    this._removeEvent();
    this.trackData = [];
  }

  show(val) {
    this.trackData = val;
    const _bbox = bbox(
      lineString(this.trackData.map((item) => [item.lon, item.lat]))
    );
    Mapbox.getMap().fitBounds(_bbox, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
    this.shipTrack.addTracks(this.trackData);
  }

  hide() {
    this.shipTrack.addTracks([]);
  }

  _initEvent() {
    this.shipTrack.onMousemove(this.moveFunc);
    this.shipTrack.onMouseout(this.outFunc);
  }

  _removeEvent() {
    this.shipTrack.offMousemove(this.moveFunc);
    this.shipTrack.offMouseout(this.outFunc);
  }

  _move(e) {
    if (validatenull(e)) return;
    this._removePopup();
    this.popup = this._addPopup(e[0]);
  }

  _out() {
    this._removePopup();
  }

  _addPopup({ properties, geometry }) {
    const center = geometry.coordinates;
    let htmlStr = "";
    const getFormValue = (config, data) => {
      if (validatenull(config.format)) {
        const result = data[config.prop];
        return validatenull(result) ? "暂无数据" : result;
      } else {
        return config.format({
          key: config.prop,
          shipData: data,
        });
      }
    };
    this.formConfig.forEach((item) => {
      htmlStr += `
          <div class="ship-form-item">
            <div class="ship-label">
                ${item.label}：
            </div>
            <div class="ship-value">
              ${getFormValue(item, properties)}
            </div>
          </div>
        `;
    });
    const html = `
        <div class="ship-form">
          ${htmlStr}
        </div>
  `;
    return new this.ehhGis.Popup({
      className: "ship-popup",
      closeOnClick: false,
      maxWidth: "none",
    })
      .setLngLat(center)
      .setHTML(html)
      .addTo(this.map);
  }

  _removePopup() {
    this.popup && this.popup.remove();
    this.popup = null;
  }
}

export default new MapboxShipTrack();
