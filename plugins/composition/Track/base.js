import { Element, Position } from "../Collision.js";
import moment from "moment";
import {
  addLayer,
  addSource,
  changeSource,
  addUrlImage,
} from "../../utils/util.js";
import { featureCollection } from "@turf/turf";

import ehh_ship_track_arrow from "./image/arrow.png";
import ehh_ship_track_star from "./image/track_star.png";
import ehh_ship_track_stop from "./image/track_stop.png";

function projectFeature(map, feature) {
  if (!feature) {
    return null;
  }

  let geom = feature.geometry;
  if (geom.type !== "Point") {
    return null;
  }
  const lnglat = geom.coordinates;

  if (map !== undefined && map.project) {
    const point = map.project(lnglat);
    const x = Math.round(point.x);
    const y = Math.round(point.y);
    return { x: x, y: y };
  }

  return null;
}
export default class ShipTrackBase {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  constructor(map) {
    this.map = map;
    this.canvasEl = null;
    this._ctx = null;
    this.canvasFont = {
      fontSize: 12,
      fontFace: "Arial",
    };
    this.imgList = [
      {
        id: "ehh_ship_track_arrow",
        name: "箭头",
        image: ehh_ship_track_arrow,
      },
      {
        id: "ehh_ship_track_star",
        name: "起点",
        image: ehh_ship_track_star,
      },
      {
        id: "ehh_ship_track_stop",
        name: "结束",
        image: ehh_ship_track_stop,
      },
    ];
    this.staticLayer = [
      {
        id: `ehh-ship-track-line-layer`,
        cnName: "轨迹线图层",
        filter: ["all", ["==", "$type", "LineString"]],
        source: `ehh-ship-track-source`,
        type: "line",
        layout: {},
        paint: {
          "line-color": [
            "case",
            [">", ["get", "average"], 6.1],
            "#4695EA",
            "#7FF360",
          ],
          "line-width": 2,
        },
      },
      {
        id: `ehh-ship-track-layer`,
        cnName: "轨迹点图层",
        filter: ["all", ["==", "$type", "Point"]],
        source: `ehh-ship-track-source`,
        type: "circle",
        // type: 'symbol',
        layout: {
          // 'icon-image': 'ehh_trajectory_point',
          // 'icon-size': 0.8,
          // 'icon-allow-overlap': true,
        },
        paint: {
          "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 1, 24, 3],
          "circle-color": "#fff",
          "circle-stroke-width": 1.5,
          "circle-stroke-color": "red",
        },
      },
      {
        id: `ehh-ship-track-toward-layer`,
        cnName: "轨迹朝向",
        source: `ehh-ship-track-source`,
        type: "symbol",
        layout: {
          "symbol-placement": "line",
          "symbol-spacing": 50, // 图标间隔，默认为250
          "icon-image": "ehh_ship_track_arrow", //箭头图标
          "icon-size": 1,
          // 'icon-allow-overlap': true,
          // "icon-size": 0.6,
        },
        paint: {},
      },
      {
        id: `ehh-ship-track-star-end-layer`,
        cnName: "轨迹起点与终点",
        source: `ehh-ship-track-source`,
        type: "symbol",
        layout: {
          "icon-image": ["get", "imageName"],
          "icon-size": ["interpolate", ["linear"], ["zoom"], 0, 0.2, 19, 0.5],
          "icon-rotate": ["get", "course"],
          "icon-allow-overlap": true,
          // 'icon-allow-overlap': true,
          // "icon-size": 0.6,
        },
        paint: {},
      },
    ];
    this.canvasInit();
    this.regist();
    // this.collision = new Collision(map, this.position, this)
  }
  init() {
    this.staticLayer.forEach((info) => {
      addSource(this.map, `${info.source}`);
      addLayer(this.map, {
        ...info,
        id: `${info.id}`,
      });
    });
    this.imgList.forEach((img) => {
      if (this.map.hasImage(img.id)) {
        this.map.removeImage(img.id);
      }
      addUrlImage(this.map, {
        name: img.id,
        url: img.image,
      });
    });
  }
  canvasInit() {
    if (document.getElementById("ehh-ship-track-canvas")) {
      document.getElementById("ehh-ship-track-canvas").remove();
    }
    this.canvasEl = document.createElement("canvas");
    this.canvasEl.style.position = "absolute";
    this.canvasEl.style.left = "0px";
    this.canvasEl.style.top = "0px";
    this.canvasEl.style.zIndex = 9999;
    this.canvasEl.style.pointerEvents = "none";
    const dpr = window.devicePixelRatio || 1;
    this.canvasEl.id = "ehh-ship-track-canvas";
    this.mapboxCanvas = this.map.getCanvas();
    this.canvasEl.style.width = this.mapboxCanvas.style.width;
    this.canvasEl.style.height = this.mapboxCanvas.style.height;
    this.canvasEl.width = Math.round(
      parseInt(this.mapboxCanvas.style.width) * dpr,
    );
    this.canvasEl.height = Math.round(
      parseInt(this.mapboxCanvas.style.height) * dpr,
    );
    this._ctx = this.canvasEl.getContext("2d");
    this._ctx.font = `${this.canvasFont.fontSize}px ${this.canvasFont.fontFace}`;
    this.map.getContainer().appendChild(this.canvasEl);
  }
  canvasResize() {
    const dpr = window.devicePixelRatio || 1;
    // this.canvasEl.style.position = 'absolute'
    // this.canvasEl.style.left = '0px'
    // this.canvasEl.style.top = '0px'
    // this.canvasEl.style.zIndex = 99
    // this.canvasEl.style.display = 'none'
    this.canvasEl.style.width == this.mapboxCanvas.style.width;
    this.canvasEl.style.height == this.mapboxCanvas.style.height;
    this._ctx = this.canvasEl.getContext("2d");
    this.canvasEl.width = Math.round(
      parseInt(this.mapboxCanvas.style.width) * dpr,
    );
    this.canvasEl.height = Math.round(
      parseInt(this.mapboxCanvas.style.height) * dpr,
    );
    this._ctx.scale(dpr, dpr);
  }
  regist() {
    this.map.on("move", () => {
      this.repaint();
    });
    this.map.on("resize", () => {
      if (!this.map) return false;
      const dpr = window.devicePixelRatio || 1;
      this.canvasEl.style.width = this.mapboxCanvas.style.width;
      this.canvasEl.style.height = this.mapboxCanvas.style.height;
      this.canvasEl.width = Math.round(
        parseInt(this.mapboxCanvas.style.width) * dpr,
      );
      this.canvasEl.height = Math.round(
        parseInt(this.mapboxCanvas.style.height) * dpr,
      );
      this._ctx.scale(dpr, dpr);
      this.repaint();
    });
  }
  repaint() {
    if (!this._ctx) {
      return;
    }
    this.canvasResize();
    this._ondatachangeAll();
  }
  _draw(element) {
    let pt = projectFeature(this.map, element.raw);
    if (null == pt || !this._ctx || !element || !element.visibility) {
      return;
    }
    let rect = element.rect();
    const text = element.raw.text || element.raw.text || element.raw.text;

    this._ctx.save();
    this._ctx.beginPath();
    this._ctx.lineWidth = 1;
    this._ctx.strokeStyle = `rgba(0,0,0,1)`;
    this._ctx.moveTo(pt.x, pt.y);
    this._ctx.lineTo(rect.x + rect.w / 2, rect.y + rect.h / 2);
    this._ctx.closePath();
    this._ctx.stroke();
    this._ctx.fillStyle = "rgba(255,255,255,1)";
    this._ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    this._ctx.lineWidth = 2;
    this._ctx.strokeStyle = `rgba(69,147,237,0.8)`;
    this._ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    this._ctx.fillStyle = "#1D374C";
    this._ctx.fillText(`${text}`, rect.x + 4, rect.y - 4 + rect.h);
    this._ctx.restore();
  }
  _ondatachangeAll() {
    let FeatureCollection = featureCollection([]);
    this.canvasResize();
    Object.keys(this.trackData).forEach((key) => {
      //不存在则不处理
      if (!this.trackData[key]) return false;
      this.trackData[key].collision.clear();
      if (this.trackData[key].isShow) {
        this.trackData[key].data.features.forEach((feature) => {
          // item.features.forEach((item) => {
          FeatureCollection.features.push(feature);
          if (this.trackData[key].isShowTimeTag) {
            if (feature.geometry.type === "Point") {
              this.trackData[key].collision.insert2({
                geometry: feature.geometry,
                text: moment(Number(feature.properties.time)).format(
                  "YYYY-MM-DD HH:mm:ss",
                ),
              });
            }
          }
          // })
        });
        const treeData = this.trackData[key].collision.update();
        treeData.forEach((item) => {
          if (item.visibility) {
            this._draw(item);
          }
        });
      }
    });
    changeSource(this.map, "ehh-ship-track-source", FeatureCollection);
  }

  //key 轨迹唯一id
  _ondatachange(key) {
    //不存在则不处理
    if (!this.trackData[key]) return false;
    this.trackData[key].collision.clear();

    if (this.trackData[key].isShow) {
      this.trackData[key].collision.clear();
      let FeatureCollection = featureCollection([]);
      this.trackData[key].data.features.forEach((feature) => {
        // item.features.forEach((item) => {
        FeatureCollection.features.push(feature);
        if (this.trackData[key].isShowTimeTag) {
          if (feature.geometry.type === "Point") {
            this.trackData[key].collision.insert2({
              geometry: feature.geometry,
              text: moment(Number(feature.properties.time)).format(
                "YYYY-MM-DD HH:mm:ss",
              ),
            });
          }
        }
        // })
      });
      const treeData = this.trackData[key].collision.update();
      treeData.forEach((item) => {
        if (item.visibility) {
          this._draw(item);
        }
      });
      changeSource(this.map, "ehh-ship-track-source", FeatureCollection);
    }
  }
  //碰撞逻辑
  position(self, map, p) {
    // const raw = self
    const center = projectFeature(map, self);
    const padding = 3;

    if (null == center) {
      return;
    }
    //字体问题 需要偏移9
    const delta_text_y = 9;
    // const text = raw.properties.cnname || raw.properties.enname || raw.properties.mmsi
    const text = self.text;
    // this.rootThis._ctx.font = `${this.rootThis.canvasFont.fontSize}px ${this.rootThis.canvasFont.fontFace}`

    const metrics = this.rootThis._ctx.measureText(`${text}`);

    const minx = center.x - metrics.actualBoundingBoxLeft - padding;
    const maxx = center.x + metrics.actualBoundingBoxRight + padding;
    const miny = center.y - metrics.actualBoundingBoxAscent - padding;
    const maxy = center.y + metrics.actualBoundingBoxDescent + padding;
    let bbox = new Element(minx, miny, maxx, maxy);
    const rect = bbox.rect();

    bbox.add({
      x: Math.round(-rect.w / 2) + padding - metrics.actualBoundingBoxLeft,
      y: Math.round(
        -rect.h / 2 + delta_text_y + padding - metrics.actualBoundingBoxAscent,
      ),
    });

    const dpr = window.devicePixelRatio || 1;
    //斜线长度的xy
    let deltaX = 10 * dpr;
    let deltaY = 10 * dpr;
    const center_box = 40 * dpr;
    // p = Position.top_right
    switch (p) {
      default:
      case Position.center: {
        bbox.minX = center.x - center_box;
        bbox.minY = center.y - center_box;
        bbox.maxX = center.x + center_box;
        bbox.maxY = center.y + center_box;
        bbox.visibility = false;
        break;
      }
      case Position.top_right: {
        bbox.add({ x: deltaX, y: -deltaY }, "top_right");
        // self.properties.position = 'bottom-left'
        break;
      }
      case Position.right: {
        bbox.add({ x: deltaX, y: 0 }, "right");
        // self.properties.position = 'left'
        break;
      }
      case Position.bottom_right: {
        bbox.add({ x: deltaX, y: deltaY }, "bottom_right");
        // self.properties.position = 'top-left'
        break;
      }
      case Position.bottom: {
        // deltaY = 2 * deltaY
        bbox.add({ x: 0, y: deltaY }, "bottom");
        // self.properties.position = 'top'
        break;
      }
      case Position.bottom_left: {
        bbox.add({ x: -deltaX, y: deltaY }, "bottom_left");
        // self.properties.position = 'top-right'
        break;
      }
      case Position.left: {
        // deltaX = 2 * deltaX
        bbox.add({ x: -deltaX, y: 0 }, "left");
        // self.properties.position = 'right'
        break;
      }
      case Position.top_left: {
        bbox.add({ x: -deltaX, y: -deltaY }, "top_left");
        // self.properties.position = 'bottom-right'
        break;
      }
      case Position.top: {
        // deltaY = 2 * deltaY
        bbox.add({ x: 0, y: -deltaY }, "top");
        // self.properties.position = 'bottom'
        break;
      }
    }
    return bbox;
  }
}
