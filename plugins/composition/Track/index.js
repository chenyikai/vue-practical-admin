import { cloneDeep } from "lodash";
import { Collision } from "../Collision.js";
import { featureCollection, feature, lineString } from "@turf/turf";
import { clearBySource } from "../../utils/util.js";
import { kvToJson } from "@/utils/util.js";
import ShipTrackBase from "./base.js";

export default class ShipTrack extends ShipTrackBase {
  constructor(options) {
    super(options);
    this.trackData = {};
    return this;
  }
  /**
   *  设置轨迹
   * @param {*} data  数据中心kv格式
   */
  trackSetData(data, shipInfo, istimetag) {
    if (!data || !data.k || !data.v || data.v.length === 0) {
      return false;
    }
    // 自定义轨迹唯一id
    const key = `${shipInfo.mmsi}${shipInfo.startTime}${shipInfo.endTime}`;
    //若已存在相同轨迹 则不操作
    // if (this.trackData[key]) return false
    //data:轨迹点线数据，shipInfo 哪艘船舶，collision 本条轨迹碰撞逻辑
    this.trackData[key] = {
      data: featureCollection([]),
      shipInfo: cloneDeep(shipInfo),
      collision: new Collision(this.map, this.position, this),
      isShow: true,
      isShowTimeTag: istimetag,
    };

    kvToJson(data.k, data.v).forEach((trackInfo, index) => {
      const text = trackInfo.time;
      //每段轨迹首位节点图标
      let properties = { trackOnlyId: `${key}`, ...trackInfo, text: text };
      if (index === 0) {
        properties = {
          trackOnlyId: `${key}`,
          ...trackInfo,
          text: text,
          imageName: "ehh_ship_track_stop",
        };
      }
      if (index === data.v.length - 1) {
        properties = {
          trackOnlyId: `${key}`,
          ...trackInfo,
          text: text,
          imageName: "ehh_ship_track_star",
        };
      }
      //每段数据轨迹点数据
      this.trackData[key].data.features.push(
        feature(
          {
            type: "Point",
            coordinates: [trackInfo.lon, trackInfo.lat],
          },
          {
            ...properties,
          },
        ),
      );
    });
    const lineStringList = kvToJson(data.k, data.v)
      .map((value, index, array) => {
        if (index < array.length - 1) {
          return [value, array[index + 1]];
        }
        return null;
      })
      .filter((item) => item !== null);
    //每段轨迹线数据（每两点成一条线，方便控制线段的颜色）
    lineStringList.forEach((item) => {
      let average = 0;
      if (item[0].sog > 6) {
        average = item[0].sog;
      }
      if (item[1].sog > 6) {
        average = item[1].sog;
      }
      this.trackData[key].data.features.push(
        lineString(
          [
            [item[0].lon, item[0].lat],
            [item[1].lon, item[1].lat],
          ],
          {
            average: average,
            trackOnlyId: key,
          },
        ),
      );
    });
    this._ondatachange(key);
    return true;
  }
  hideAllTrack() {
    Object.keys(this.trackData).forEach((key) => {
      this.hideTrack(key);
    });
    this._ondatachangeAll();
  }
  showTrack(id) {
    if (this.trackData[id]) {
      this.trackData[id].isShow = true;
    }
    this._ondatachangeAll();
  }
  hideTrack(id) {
    if (this.trackData[id]) {
      this.trackData[id].isShow = false;
    }
    this._ondatachangeAll();
  }
  removeTrack(id) {
    if (this.trackData[id]) {
      delete this.trackData[id];
    }
    this._ondatachangeAll();
  }
  showTrackTimeTag(id) {
    if (this.trackData[id]) {
      this.trackData[id].isShowTimeTag = true;
    }
    this._ondatachangeAll();
  }
  hideTrackTimeTag(id) {
    if (this.trackData[id]) {
      this.trackData[id].isShowTimeTag = false;
    }
    this._ondatachangeAll();
  }

  showTrackSpeedDifference() {
    this.map.setPaintProperty("ehh-ship-track-line-layer", "line-color", [
      "case",
      [">", ["get", "average"], 6.1],
      "#4695EA",
      "#7FF360",
    ]);
  }
  hideTrackSpeedDifference() {
    this.map.setPaintProperty(
      "ehh-ship-track-line-layer",
      "line-color",
      "#4695EA",
    );
  }
  //隐藏所有时间标签线
  hideAllTimeTag() {
    this.canvasEl.style.display = "none";
  }
  showAllTimeTage() {
    this.canvasEl.style.display = "block";
  }
  clearAllData() {
    this.trackData = {};
    this.staticLayer.forEach((layerInfo) => {
      clearBySource(this.map, layerInfo.source);
    });
    this.canvasResize();
  }
}
