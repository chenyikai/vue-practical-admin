import { throttle } from "lodash";
import length from "@turf/length";
import { point } from "@turf/helpers";
import midpoint from "@turf/midpoint";
import rhumbBearing from "@turf/rhumb-bearing";
import greatCircle from "@turf/great-circle";
import { GEOJSON_TYPES, SOURCES } from "./src/Constants";
import { formatDegree } from "./src/util";
import hat from "hat";
import styles from "./src/theme";
// import "./index.scss";
class EhhRouteDraw {
  /**
   * 内容实例
   */
  _container;

  /**
   * 地图实例
   */
  map;

  /**
   * 判断加载完成 定时器
   */
  loadedInterval;

  /**
   * 数据源
   */
  source;

  /**
   * 绘制路径
   */
  paths = [];

  _onClickHandler;

  _onMousemoveHandler;

  _onDblclickHandler;

  /**
   * 数据源缓存
   */
  _features = [];

  /**
   * 绘制过程缓存
   */
  _featuresCache = [];

  _createContainer() {
    const frag = document.createDocumentFragment();
    return frag;
  }

  onAdd(map) {
    this.map = map;

    if (this.map.loaded()) {
      this.connect();
    } else {
      this.map.on("load", this.connect.bind(this));
      this.loadedInterval = setInterval(() => {
        if (this.map.loaded()) this.connect();
      }, 16);
    }

    this._container = this._createContainer();
    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._removeLayers();
  }

  connect() {
    this.map.off("load", this.connect);
    this.loadedInterval && clearInterval(this.loadedInterval);

    this._addLayers();
    this.source = this.map.getSource(SOURCES.DEFAULT);

    /**
     * 添加监听绑定
     */
    this._onClickHandler = this._onClickListener.bind(this);
    this._onMousemoveHandler = throttle(this._onMousemoveListener, 20).bind(
      this
    );
    this._onDblclickHandler = this._onDblclickListener.bind(this);
  }

  /**
   * 添加图层和数据源
   */
  _addLayers() {
    this.map.addSource(SOURCES.DEFAULT, {
      data: {
        type: GEOJSON_TYPES.FEATURE_COLLECTION,
        features: [],
      },
      type: "geojson",
    });
    styles.forEach((style) => {
      this.map.addLayer(style);
    });
  }

  /**
   * 移除图层和数据源
   */
  _removeLayers() {
    this._reset();
    styles.forEach((style) => {
      if (this.map.getLayer(style.id)) {
        this.map.removeLayer(style.id);
      }
    });
    this.map.removeSource(SOURCES.DEFAULT);
  }

  _onClickListener(event) {
    if (
      Array.isArray(this._featuresCache) &&
      this._featuresCache.length !== 0
    ) {
      this._features.push(...this._featuresCache);
      this._featuresCache = [];
    }

    const p = [event.lngLat.lng, event.lngLat.lat];

    this.paths.push(p);
    if (this.paths.length === 1) {
      this._features.push(
        point(p, { $index: this.paths.length, type: "endpoint", id: hat() })
      );
    }

    // 第一次插入数据的时候加入监听
    if (this.paths.length === 1) {
      this.map.on("mousemove", this._onMousemoveHandler);
      this.map.once("dblclick", this._onDblclickHandler);
    }
  }

  _getLinesByPaths(paths, endPath) {
    if (paths.length < 1) return [];

    const p1 = paths[paths.length - 1];
    const p2 = endPath;

    const line = greatCircle(p1, p2, { npoints: 50 });
    line.properties.$index = this.paths.length + 1;
    line.properties.id = hat();

    const center = midpoint(p1, p2);
    const bearing = rhumbBearing(p1, p2);
    // 距离
    center.properties.distance = length(line, { units: "nauticalmiles" });
    center.properties.distanceText = `${length(line, {
      units: "nauticalmiles",
    }).toFixed(2)} nmi`;
    // 方位角
    center.properties.bearing = bearing;
    center.properties.bearingText = `CA ${formatDegree(bearing).value}`;

    // 文本绘制方向
    center.properties.textBearing = bearing >= 0 ? bearing - 90 : bearing + 90;
    center.properties.type = "center";
    center.properties.$index = this.paths.length + 1;

    const endpoint = point(p2, {
      $index: this.paths.length + 1,
      type: "endpoint",
      id: hat(),
    });

    this._featuresCache = [line, center, endpoint];
  }

  /**
   * 鼠标移动时的监听
   * @param {} event
   */
  _onMousemoveListener(event) {
    this._getLinesByPaths(this.paths, [event.lngLat.lng, event.lngLat.lat]);

    this.source.setData({
      type: GEOJSON_TYPES.FEATURE_COLLECTION,
      features: this._features.concat(this._featuresCache),
    });
  }

  /**
   * 双击事件 结束绘制
   */
  _onDblclickListener() {
    this.map.off("click", this._onClickHandler);
    this.map.off("mousemove", this._onMousemoveHandler);
    this.map.fire("route.create", this._features);
    setTimeout(() => {
      this.map.doubleClickZoom.enable();
      this.startDragEndPoint();
    }, 0);
  }

  _onDragMousemoveHandler;
  _onDragMouseDownHandler;

  dragMousedownFeaturePosition;

  inPathsIndex;
  endPointFeature;
  leftCenterPointFeatureIndex;
  rightCenterPointFeatureIndex;
  leftLineStringFeature;
  rightLintStringFeature;

  dragMousemoveListener({ lngLat }) {
    const p = [lngLat.lng, lngLat.lat];
    this.endPointFeature = point(p, this.endPointFeature.properties);
    this.paths.splice(this.inPathsIndex, 1, p);
    const endPointFeatureIndex = this._features.findIndex(
      (item) => item.properties.id === this.endPointFeature.properties.id
    );
    this._features.splice(endPointFeatureIndex, 1, this.endPointFeature);

    if (this.leftLineStringFeature) {
      const startPoint = this.leftLineStringFeature.geometry.coordinates[0];
      this.leftLineStringFeature = greatCircle(startPoint, p, {
        npoints: 50,
        properties: this.leftLineStringFeature.properties,
      });
      const leftLineStringFeatureIndex = this._features.findIndex(
        (item) =>
          item.properties.id === this.leftLineStringFeature.properties.id
      );
      this._features.splice(
        leftLineStringFeatureIndex,
        1,
        this.leftLineStringFeature
      );
      // 左侧文本
      const center = midpoint(startPoint, p);
      const bearing = rhumbBearing(startPoint, p);
      // 距离
      center.properties.distance = length(this.leftLineStringFeature, {
        units: "nauticalmiles",
      });
      center.properties.distanceText = `${length(this.leftLineStringFeature, {
        units: "nauticalmiles",
      }).toFixed(2)} nmi`;
      // 方位角
      center.properties.bearing = bearing;
      center.properties.bearingText = `CA ${formatDegree(bearing).value}`;
      // 文本绘制方向
      center.properties.textBearing =
        bearing >= 0 ? bearing - 90 : bearing + 90;
      center.properties.type = "center";
      center.properties.$index = this.leftLineStringFeature.properties.$index;
      this._features.splice(this.leftCenterPointFeatureIndex, 1, center);
    }

    if (this.rightLintStringFeature) {
      const endPoint =
        this.rightLintStringFeature.geometry.coordinates[
          this.rightLintStringFeature.geometry.coordinates.length - 1
        ];

      this.rightLintStringFeature = greatCircle(p, endPoint, {
        npoints: 50,
        properties: this.rightLintStringFeature.properties,
      });
      const rightLintStringFeatureIndex = this._features.findIndex(
        (item) =>
          item.properties.id === this.rightLintStringFeature.properties.id
      );
      this._features.splice(
        rightLintStringFeatureIndex,
        1,
        this.rightLintStringFeature
      );
      // 左侧文本
      const center = midpoint(endPoint, p);
      const bearing = rhumbBearing(endPoint, p);
      // 距离
      center.properties.distance = length(this.rightLintStringFeature, {
        units: "nauticalmiles",
      });
      center.properties.distanceText = `${length(this.rightLintStringFeature, {
        units: "nauticalmiles",
      }).toFixed(2)} nmi`;
      // 方位角
      center.properties.bearing = bearing;
      center.properties.bearingText = `CA ${formatDegree(bearing).value}`;
      // 文本绘制方向
      center.properties.textBearing =
        bearing >= 0 ? bearing - 90 : bearing + 90;
      center.properties.type = "center";
      center.properties.$index = this.rightLintStringFeature.properties.$index;
      this._features.splice(this.rightCenterPointFeatureIndex, 1, center);
    }

    this.source.setData({
      type: GEOJSON_TYPES.FEATURE_COLLECTION,
      features: this._features,
    });
  }

  dragMousedownListener({ point }) {
    const features = this.map.queryRenderedFeatures(point, {
      layers: ["ehh-route-draw.end-point"],
    });

    // 获取到选中的特征点
    this.endPointFeature = this._features.find((f) => {
      return (
        f.geometry.type === "Point" &&
        f.properties.id === features[features.length - 1].properties.id
      );
    });
    const index = this.endPointFeature.properties.$index;
    this.inPathsIndex = index - 1;
    this.leftLineStringFeature = this._features.find((f) => {
      return f.geometry.type === "LineString" && f.properties.$index === index;
    });
    this.rightLintStringFeature = this._features.find((f) => {
      return (
        f.geometry.type === "LineString" && f.properties.$index === index + 1
      );
    });
    this.leftCenterPointFeatureIndex = this._features.findIndex((f) => {
      return (
        f.geometry.type === "Point" &&
        f.properties.$index === index &&
        f.properties.type === "center"
      );
    });
    this.rightCenterPointFeatureIndex = this._features.findIndex((f) => {
      return (
        f.geometry.type === "Point" &&
        f.properties.$index === index + 1 &&
        f.properties.type === "center"
      );
    });

    this.map.dragPan.disable();
    this.map.once("mouseup", () => {
      this.map.off("mousemove", this._onDragMousemoveHandler);
      this.map.dragPan.enable();
    });
    this.map.on("mousemove", this._onDragMousemoveHandler);
  }

  /**
   * 开启按下拖拽
   */
  startDragEndPoint() {
    this._onDragMouseDownHandler = this.dragMousedownListener.bind(this);
    this._onDragMousemoveHandler = this.dragMousemoveListener.bind(this);

    this.map.on(
      "mousedown",
      "ehh-route-draw.end-point",
      this._onDragMouseDownHandler
    );
  }

  /**
   * 结束按下拖拽
   */
  endDragEndPoint() {
    this.map.off(
      "mousedown",
      "ehh-route-draw.end-point",
      this._onDragMouseDownHandler
    );
  }

  _reset() {
    this.paths = [];
    this._features = [];
    this.source.setData({
      type: GEOJSON_TYPES.FEATURE_COLLECTION,
      features: [],
    });

    this.map.off("click", this._onClickHandler);
    this.map.off("mousemove", this._onMousemoveHandler);
    this.map.off("dblclick", this._onDblclickHandler);
  }

  start() {
    this.map.doubleClickZoom.disable();
    this._reset();

    this.map.on("click", this._onClickHandler);
  }
}

export default EhhRouteDraw;
