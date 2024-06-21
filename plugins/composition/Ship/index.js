import EventEmitter from "eventemitter3";
import {
  OUT_SHIP,
  OWN_SHIP,
  formConfig,
  INTERVAL,
  GHOST_SHIP,
} from "./vars.js";
import {
  getExternalShip,
  getGreenDot,
  getInternalShip,
  getShipIcon,
} from "@/api/map/ship.js";
import { validatenull } from "@/utils/validate.js";
import { cloneDeep, set } from "lodash";
import getContext from "get-canvas-context";
import svgToImage from "svg-to-image";

const properties = ["imageName", "shipDataType", "shipFrom"];

class MapboxShip extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;
  ship = null;
  ehhGis = null;
  keys = [];
  icons = [];
  popup = null;
  timer = null;
  isInit = false;
  shipData = {
    [OUT_SHIP]: [],
    [OWN_SHIP]: [],
    [GHOST_SHIP]: [],
  };
  focusShip = {};
  reload_own_color = [];

  moveStartFun = this._onMoveStart.bind(this);
  moveFun = this._onMove.bind(this);
  moveEndFun = this._onMoveEnd.bind(this);
  clickFun = this._onClick.bind(this);
  mouseMoveFun = this._onMouseMove.bind(this);
  mouseOutFun = this._onMouseOut.bind(this);

  constructor({ map, ship, ehhGis }) {
    super();

    this.map = map;
    this.ship = ship;
    this.ehhGis = ehhGis;
  }

  init() {
    this.isInit = true;
    this._addIcon();
    this.getData();
    this._addEvents();

    this._timeTask();
  }

  destroy() {
    this.isInit = false;
    this._removeEvents();
    this._removePopup();
    this._clearTask();

    this.map = null;
    this.ship = null;
    this.ehhGis = null;
    this.keys = [];
    this.popup = null;
    this.timer = null;
    this.focusShip = {};
    this.shipData = {
      [OUT_SHIP]: [],
      [OWN_SHIP]: [],
      [GHOST_SHIP]: [],
    };
  }

  getData() {
    let shipData = [...this.shipData[GHOST_SHIP]];
    this._getDataKey().then(async (keys) => {
      if (this.map.getZoom() < 12) {
        this._addGreenDot();
        // this._addInternal(keys).then((ownV) => {
        //   shipData = [...ownV];
        // });
      } else {
        await Promise.allSettled([
          // this._addInternal(keys),
          this._addExternal(keys),
        ]).then(() => {
          shipData = [...this.shipData[OUT_SHIP], ...this.shipData[OWN_SHIP]];
        });
      }

      // if (shipData.length > 0) {
      this.ship.addShips({
        k: [...keys, ...properties],
        v: this._unique([...keys, ...properties], shipData, "mmsi"),
      });

      if (this.focusShip) {
        this.ship.setSelectedShip(this.focusShip.mmsi, true);
      }
      // }
    });
  }

  async isOwnShip(ship) {
    const k = await this._getDataKey();
    const index = this._getIndex(k, "mmsi");
    const mmsiList = this.shipData[OWN_SHIP].map((item) => item[index]);
    return mmsiList.findIndex((mmsi) => mmsi === ship.mmsi) !== -1;
  }

  refresh() {
    this.getData();
  }

  getOutType() {
    return OUT_SHIP;
  }

  getOwnType() {
    return OWN_SHIP;
  }

  getBounds() {
    const { _ne: maxData, _sw: minData } = this.map.getBounds();
    const level = this.map.getZoom();
    return {
      maxLon: maxData.lng,
      minLon: minData.lng,
      maxLat: maxData.lat,
      minLat: minData.lat,
      level,
    };
  }

  setFocus(val, zoom = 14) {
    if (validatenull(val)) {
      this.focusMmsi = null;
      this.ship.cancelSelectedShip();
      return;
    }

    if (val.location) {
      this._addGhost(val);
      const [lat, lon] = val.location.split(",");
      this.map.setCenter([lon, lat]);
      this.map.setZoom(zoom);
      // this.map.flyTo({
      //   center: [lon, lat],
      //   zoom,
      // });
    }
  }

  _addGreenDot() {
    getGreenDot(this.getBounds()).then(({ data }) => {
      this.ship.addMultipoint(data.data);
    });
  }

  _addGhost(data) {
    this.focusShip = data;

    let v = [];
    this.keys.forEach((key) => {
      v.push(data[this._convertKey(key)] || null);
    });
    set(this.shipData, GHOST_SHIP, [v]);
  }

  _addInternal(keys) {
    return new Promise((resolve, reject) => {
      getInternalShip()
        .then(({ data }) => {
          //TODO 可以加内部船舶的过滤
          const shipData = data.data;
          const vs = [];
          shipData.forEach((ship) => {
            let v = [];
            keys.forEach((key) => {
              v.push(ship[this._convertKey(key)] || null);
            });
            v = this._addExtraField(v, {
              imageName: ship["teamId"],
              shipDataType: OWN_SHIP,
              shipFrom: "my",
            });
            vs.push(v);
          });

          set(this.shipData, OWN_SHIP, vs);
          resolve(this.shipData[OWN_SHIP]);
        })
        .catch((e) => reject(e));
    });
  }

  _addExternal() {
    return new Promise((resolve, reject) => {
      getExternalShip(this.getBounds())
        .then(({ data }) => {
          set(
            this.shipData,
            OUT_SHIP,
            data.data.v.map((v) =>
              this._addExtraField(v, {
                imageName: null,
                shipDataType: OUT_SHIP,
                shipFrom: "ais",
              }),
            ),
          );
          resolve(this.shipData[OUT_SHIP]);
        })
        .catch((e) => reject(e));
    });
  }

  _addIcon() {
    return new Promise((resolve, reject) => {
      if (this.icons.length > 0) {
        return resolve(this.icons);
      }

      getShipIcon()
        .then(({ data }) => {
          this.icons = data.data;
          data.data.forEach((item) => {
            this.getShipImage(item.color).then((url) => {
              this.map.loadImage(url, (err, image) => {
                if (err) return reject(err);
                if (!this.map.hasImage(item.id)) {
                  this.map.addImage(item.id, image);
                }
              });
            });
          });
          resolve(this.icons);
        })
        .catch((e) => reject(e));
    });
  }

  getShipImage(color) {
    return new Promise((resolve, reject) => {
      const context = getContext("2d", {
        width: 25,
        height: 56,
      });
      const shipImgSvg = [
        `<svg width="25" height="56" viewBox="0 0 25 56" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 25.422L12.5 3L24 25.422V55H1V25.422Z" fill="${color}" stroke="black" stroke-width="2"/>
</svg>
`,
      ].join("\n");
      svgToImage(shipImgSvg, (error, image) => {
        if (error) {
          reject(error);
          throw error;
        }
        context.drawImage(image, 0, 0);
        resolve(context.canvas.toDataURL("image/png"));
      });
    });
  }

  _addExtraField(v, fields) {
    return [...cloneDeep(v), ...Object.values(fields)];
  }

  _addEvents() {
    this.map.on("movestart", this.moveStartFun);
    this.map.on("move", this.moveFun);
    this.map.on("moveend", this.moveEndFun);
    this.ship.onClick(this.clickFun);
    this.ship.onMousemove(this.mouseMoveFun);
    this.ship.onMouseout(this.mouseOutFun);
  }

  _removeEvents() {
    this.map.off("movestart", this.moveStartFun);
    this.map.off("move", this.moveFun);
    this.map.off("moveend", this.moveEndFun);
    this.ship.offClick(this.clickFun);
    this.ship.offMousemove(this.mouseMoveFun);
    this.ship.offMouseout(this.mouseOutFun);
  }

  _timeTask() {
    this.timer = setInterval(() => {
      if (!this.map.isMoving()) {
        this.getData();
      }
    }, INTERVAL);
  }

  _clearTask() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

  _addPopup(data) {
    const { lon, lat } = data;
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
    formConfig.forEach((item) => {
      htmlStr += `
          <div class="ship-form-item">
            <div class="ship-label">
                ${item.label}：
            </div>
            <div class="ship-value">
              ${getFormValue(item, data)}
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
      .setLngLat([lon, lat])
      .setHTML(html)
      .addTo(this.map);
  }

  _removePopup() {
    this.popup && this.popup.remove();
    this.popup = null;
  }

  _unique(k, v, key) {
    const index = this._getIndex(k, key);
    const shipMap = new Map();
    v.filter(
      (item) => !shipMap.has(item[index]) && shipMap.set(item[index], item),
    );
    return Array.from(shipMap.values());
  }

  _getIndex(k, key) {
    return k.findIndex((item) => item === key);
  }

  _getDataKey() {
    return new Promise((resolve, reject) => {
      if (this.keys.length > 0) {
        resolve(this.keys);
      } else {
        getExternalShip(this.getBounds())
          .then(({ data }) => {
            this.keys = this._keyMap(data.data.k);
            resolve(this.keys);
          })
          .catch((e) => reject(e));
      }
    });
  }

  _keyMap(keys = []) {
    const newKeys = keys.map((key) => {
      return this._convertKey(key);
    });
    // return [...newKeys, ...properties];
    return newKeys;
  }

  _convertKey(key) {
    // 新转旧
    if (key === "hdg") return "trueHeadOverGround";
    if (key === "cog") return "courseOverGround";
    if (key === "rot") return "rateOfTurn";
    // if (key === "ts0") return "updateTime";
    if (key === "sog") return "speedOverGround";
    if (key === "enname") return "enName";
    if (key === "cnname") return "cnName";

    // 旧转新
    if (key === "trueHeadOverGround") return "hdg";
    if (key === "courseOverGround") return "cog";
    if (key === "rateOfTurn") return "rot";
    // if (key === "updateTime") return "ts0";
    if (key === "speedOverGround") return "sog";
    if (key === "enName") return "enname";
    if (key === "cnName") return "cnname";
    return key;
  }

  _onMoveStart() {
    this._clearTask();
  }

  _onMove() {}

  _onMoveEnd() {
    this.getData();
    this._timeTask();
  }

  _onClick(e) {
    this.ship.setSelectedShip(e[0].id, true);
    this.emit("click", e[0]);
  }

  _onMouseMove(e) {
    if (validatenull(e)) return;
    const data = e.at(0).properties;
    if (!this.popup) {
      this.popup = this._addPopup(data);
    }
  }

  _onMouseOut() {
    this._removePopup();
  }

  addColorShip() {
    // 绘制内部船舶虚拟样式并设置图层高度
    if (this.map) {
      this.reload_own_color.forEach((item) => {
        this.getShipImage(item.color).then((url) => {
          this.map.addImage({
            url,
            name: `own-ship-${item.id}`,
          });
        });
      });
      const minzoom = 5;
      Object.keys(this.map.style._layers).forEach((key) => {
        if (key.includes("ehh-ship-name-layer")) {
          this.map.style._layers[key].minzoom = minzoom;
        } else if (key.includes("ehh-ship-name-line-img-layer")) {
          this.map.style._layers[key].minzoom = minzoom;
        }
      });
    }
  }

  getShipImage(color) {
    // 根据颜色绘制船舶图标
    return new Promise((resolve, reject) => {
      // const svgToImage = require("svg-to-image");
      // const getContext = require("get-canvas-context");
      const context = getContext("2d", {
        width: 30,
        height: 75,
      });
      const shipImgSvg = [
        `<svg width="30" height="75" viewBox="0 0 30 75" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 25.422L12.5 3L24 25.422V55H1V25.422Z" fill="${color}" stroke="black" stroke-width="2"/>
</svg>
`,
      ].join("\n");
      svgToImage(shipImgSvg, (error, image) => {
        if (error) {
          reject(error);
          throw error;
        }
        context.drawImage(image, 0, 0);
        resolve(context.canvas.toDataURL("image/png"));
      });
    });
  }
}

export default MapboxShip;
