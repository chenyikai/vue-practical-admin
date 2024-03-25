import EventEmitter from "eventemitter3";
import { validatenull } from "@/util/validate";
import { formatLatitudeAndLongitude, getDictData } from "@/util/util";
import { cloneDeep, set } from "lodash";
import moment from "moment";
import {
  getGreenPoiByRange,
  getNbShipDataList,
  getShipDataList,
} from "@/api/ship";
const interval = 1000 * 15;
const OWN_SHIP = "own";
const OUT_SHIP = "out";
class MapboxShip extends EventEmitter {
  // 地图
  map = null;
  ship = null;
  ehhGis = null;
  timer = null;
  focusMmsi = null;
  popup = null;
  config = {};
  filterData = {
    [OUT_SHIP]: {
      typeId: getDictData("ship_type")
        .map(({ value }) => value)
        .join(),
      statusId: getDictData("navigational_status")
        .map(({ value }) => value)
        .join(),
    },
    [OWN_SHIP]: {},
  };
  shipData = {
    [OUT_SHIP]: {
      k: [],
      v: [],
    },
    [OWN_SHIP]: {
      k: [],
      v: [],
    },
  };
  // 旧船舶数据
  oldShipData = {
    [OUT_SHIP]: {
      k: [],
      v: [],
    },
    [OWN_SHIP]: {
      k: [],
      v: [],
    },
  };

  formConfig = [
    {
      prop: "cnName",
      label: "船名(中文)",
    },
    {
      prop: "enName",
      label: "船名(英文)",
    },
    {
      prop: "mmsi",
      label: "MMSI",
    },
    // {
    //   prop: "typeName",
    //   label: "船舶类型",
    // },
    {
      prop: "position",
      label: "位置",
      format: ({ shipData }) => {
        const { lon, lat } = shipData;
        const { longitude, latitude } = formatLatitudeAndLongitude(lon, lat);
        return `${longitude.text} ${latitude.text}`;
      },
    },
    // {
    //   prop: "navigationStatusName",
    //   label: "航行状态",
    // },
    {
      prop: "updateTime",
      label: "更新时间",
      format: ({ key, shipData }) => {
        const data = shipData[key];
        return moment(Number(data)).format("yyyy-MM-DD HH:mm:ss");
      },
    },
  ];

  moveStartFun = this.handleMoveStart.bind(this);
  moveFun = this.handleMove.bind(this);
  moveEndFun = this.handleMoveEnd.bind(this);
  clickFun = this.handleShipClick.bind(this);
  mouseMoveFun = this.handleShipMouseMove.bind(this);
  mouseOutFun = this.handleShipMouseMoveOut.bind(this);

  setData({ map, ship, ehhGis }) {
    this.map = map;
    this.ship = ship;
    this.ehhGis = ehhGis;
  }

  /**
   * 初始化
   */
  init() {
    // 防止重复初始化
    if (this.timer) {
      this._clearTask();
      this.timer = null;
    }
    this._getShipData();
    this._timeTask();
    this._addShipEvent();
  }

  /**
   * 销毁
   */
  destroy() {
    this._removeShipEvent();
    this._clearTask();
  }

  getOutType() {
    return OUT_SHIP;
  }

  getOwnType() {
    return OWN_SHIP;
  }

  setFocus(mmsi) {
    if (validatenull(mmsi)) {
      this.focusMmsi = null;
      this.ship.cancelSelectedShip();
      return;
    }
    this.focusMmsi = mmsi;
    this.ship.setSelectedShip(mmsi, true);
    const shipData = [
      ...this.shipData[OWN_SHIP]["v"],
      ...this.shipData[OUT_SHIP]["v"],
    ];
    const index = this.getKeyIndex(this.shipData[OWN_SHIP]["k"], "mmsi");
    const _index = shipData.findIndex((item) => item[index] === mmsi);
    const locationIndex = this.getKeyIndex(
      this.shipData[OWN_SHIP]["k"],
      "location"
    );
    const [lat, lon] = shipData[_index][locationIndex].split(",");
    this.map.flyTo({
      center: [lon, lat],
      zoom: this.map.getZoom() < 14 ? 14 : this.map.getZoom(),
    });
  }

  setConfig(val) {
    this.config = val;
  }

  setFilter({ type, key, value }) {
    set(this.filterData[type], key, value);
    this.refresh();
  }

  refresh() {
    this._getShipData();
  }

  _timeTask() {
    this.timer = setInterval(() => {
      this._getShipData();
    }, interval);
  }

  _clearTask() {
    this.timer && clearInterval(this.timer);
    this.timer = null;
  }

  async _getShipData() {
    let shipData = [];
    if (this.map.getZoom() < 12) {
      if ([1, 3].includes(this.config["cb"])) {
        this._getShipPoi();
      }
      await Promise.allSettled([this._getOwnShip()]).then(([ownShip]) => {
        if (ownShip.status === "fulfilled") {
          this._setShipData({
            type: OWN_SHIP,
            value: ownShip.value.data.data,
          });
        } else {
          set(this.shipData, OWN_SHIP, this.oldShipData[OWN_SHIP]);
        }
        shipData = [...this.shipData[OWN_SHIP].v];
      });
    } else {
      await Promise.allSettled([this._getOwnShip(), this._getOutShip()]).then(
        ([ownShip, outShip]) => {
          if (ownShip.status === "fulfilled") {
            this._setShipData({
              type: OWN_SHIP,
              value: ownShip.value.data.data,
            });
          } else {
            set(this.shipData, OWN_SHIP, this.oldShipData[OWN_SHIP]);
          }

          if (outShip.status === "fulfilled") {
            this._setShipData({
              type: OUT_SHIP,
              value: outShip.value.data.data,
            });
          } else {
            set(this.shipData, OUT_SHIP, this.oldShipData[OUT_SHIP]);
          }

          shipData = [
            ...this.shipData[OWN_SHIP].v,
            ...this.shipData[OUT_SHIP].v,
          ];
        }
      );
    }

    if (shipData.length > 0) {
      this.ship.addShips({
        k: this.shipData[OWN_SHIP].k,
        v: this.uniqueData(this.shipData[OWN_SHIP]["k"], shipData, "mmsi"),
      });

      if (this.focusMmsi) {
        this.ship.setSelectedShip(this.focusMmsi, true);
      }
    }
  }

  _setShipData({ type, value }) {
    let data;
    try {
      data = this.handleShipData({
        data: value,
        type,
      });
    } catch (e) {
      data = this.oldShipData[type];
    }
    set(this.shipData, type, data);
    set(this.oldShipData, type, data);
  }

  handleShipData({ data, type }) {
    const { k, v } = cloneDeep(data);
    let newV = this.uniqueData(k, v, "mmsi").map((item) => {
      if (type === OUT_SHIP) {
        return [...item, null, null, null, type, "ais"];
      } else if (type === OWN_SHIP) {
        return [...item, this.getShipImg(k, item), type, "my"];
      } else {
        return item;
      }
    });
    let newK = [];
    if (type === OUT_SHIP) {
      newK = [...k, "teamId", "color", "imageName", "shipDataType", "shipFrom"];
    } else if (type === OWN_SHIP) {
      newK = [...k, "imageName", "shipDataType", "shipFrom"];
    } else {
      newK = k;
    }
    newK = newK.map((item) => {
      if (item === "hdg") return "trueHeadOverGround";
      if (item === "cog") return "courseOverGround";
      if (item === "rot") return "rateOfTurn";
      if (item === "ts0") return "updateTime";
      if (item === "sog") return "speedOverGround";
      if (item === "enname") return "enName";
      if (item === "cnname") return "cnName";
      return item;
    });

    if (type === OWN_SHIP) {
      // 过滤内部船舶
      // newV = newV.filter((item) =>
      //   this.checkList.includes(item[this.getKeyIndex(k, "mmsi")])
      // );
      if (![1, 2].includes(this.config["cb"])) {
        newV = [];
      }
    } else if (type === OUT_SHIP) {
      // 过滤外部船舶
      const typeIdKey = this.getKeyIndex(k, "typeId");
      const statusIdKey = this.getKeyIndex(k, "statusId");

      newV = newV.filter((item) => {
        const typeId = item[typeIdKey];
        const statusId = item[statusIdKey];
        return (
          this.filterData[OUT_SHIP]["typeId"].indexOf(typeId) !== -1 &&
          this.filterData[OUT_SHIP]["statusId"].indexOf(statusId) !== -1
        );
      });

      if (![1, 3].includes(this.config["cb"])) {
        newV = [];
      }
    }
    return { k: newK, v: newV };
  }

  getShipImg(k, val) {
    const index = this.getKeyIndex(k, "teamId");
    return `own-ship-${val[index]}`;
  }

  uniqueData(k, v, key) {
    const index = this.getKeyIndex(k, key);
    const shipMap = new Map();
    v.filter(
      (item) => !shipMap.has(item[index]) && shipMap.set(item[index], item)
    );
    return Array.from(shipMap.values());
  }

  getKeyIndex(k, key) {
    return k.findIndex((item) => item === key);
  }

  _getOwnShip() {
    return getNbShipDataList();
  }

  _getOutShip() {
    return getShipDataList(this.getBounds());
  }

  _getShipPoi() {
    getGreenPoiByRange(this.getBounds()).then(({ data }) => {
      this.ship.addMultipoint(data.data);
    });
  }

  _addShipEvent() {
    this.map.on("movestart", this.moveStartFun);
    this.map.on("move", this.moveFun);
    this.map.on("moveend", this.moveEndFun);
    this.ship.onClick(this.clickFun);
    this.ship.onMousemove(this.mouseMoveFun);
    this.ship.onMouseout(this.mouseOutFun);
  }
  _removeShipEvent() {
    this.map.off("movestart", this.moveStartFun);
    this.map.off("move", this.moveFun);
    this.map.off("moveend", this.moveEndFun);
    this.ship.offClick(this.clickFun);
    this.ship.offMousemove(this.mouseMoveFun);
    this.ship.offMouseout(this.mouseOutFun);
  }

  handleMoveStart() {
    this._clearTask();
  }
  handleMove() {
    // console.log("移动");
  }
  handleMoveEnd() {
    this._getShipData();
    // if (this.map.getZoom() >= 12) {
    //   Promise.allSettled([this._getOutShip()]).then(([outShip]) => {
    //     if (outShip.status === "fulfilled") {
    //       this._setShipData({
    //         type: OUT_SHIP,
    //         value: outShip.value.data.data,
    //       });
    //     } else {
    //       set(this.shipData, OUT_SHIP, this.oldShipData[OUT_SHIP]);
    //     }
    //
    //     const shipData = this.shipData[OUT_SHIP].v;
    //
    //     if (shipData.length > 0) {
    //       this.ship.addShips({
    //         k: SHIP_KEY,
    //         v: this.uniqueData(SHIP_KEY, shipData, "mmsi"),
    //       });
    //
    //       if (this.focusMmsi) {
    //         this.ship.setSelectedShip(this.focusMmsi, true);
    //       }
    //     }
    //   });
    // }

    this._timeTask();
  }

  handleShipMouseMove(e) {
    if (validatenull(e)) return;
    const data = e.at(0).properties;
    if (!this.popup) {
      this.popup = this._addShipPopup(data);
    }
  }

  handleShipMouseMoveOut() {
    this._removeShipPopup();
  }

  handleShipClick(e) {
    if (validatenull(e)) return;
    const data = e?.at(0);
    this.ship.setSelectedShip(data.properties.mmsi, true);
    this.emit("focus", data.properties.mmsi);
  }

  _addShipPopup(data) {
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
    this.formConfig.forEach((item) => {
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

  _removeShipPopup() {
    this.popup && this.popup.remove();
    this.popup = null;
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
}

export default new MapboxShip();
