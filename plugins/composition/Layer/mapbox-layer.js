import EventEmitter from "eventemitter3";
import {
  centerOfMass,
  lineString,
  polygonToLine,
  featureCollection,
} from "@turf/turf";
import { validatenull } from "@/utils/validate.js";
import { set, cloneDeep } from "lodash";

const SOURCE = "ehh-layer-source";
class MapboxLayer extends EventEmitter {
  /**
   * @type { mapboxgl.Map }
   */
  map = null;

  static POINT = "Point";
  static LINE_STRING = "LineString";
  static POLYGON = "Polygon";

  static POINT_STYLE = {
    featureType: MapboxLayer.Point,
    icon: null,
    "icon-size": 1,
    name: null,
  };
  static LINE_STRING_STYLE = {
    featureType: MapboxLayer.LINE_STRING,
    "background-color": "#f00",
    opacity: 1,
    "line-width": 3,
  };
  static POLYGON_STYLE = {
    featureType: MapboxLayer.POLYGON,
    "background-color": "#f00",
    opacity: 0.4,
  };

  clickFun = this._click.bind(this);
  layerData = {};

  layerList = [
    {
      id: "ehh-layer-fill-outline",
      source: SOURCE,
      type: "line",
      filter: ["has", "outline"],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": ["get", "outline"],
        // 'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0, 19, 3],
        "line-width": [
          "case",
          ["has", "outline-width"],
          ["get", "outline-width"],
          3,
        ],
      },
    },
    {
      id: "ehh-layer-fill",
      source: SOURCE,
      type: "fill",
      filter: ["==", "$type", "Polygon"],
      layout: {
        "fill-sort-key": ["get", "sort"],
      },
      paint: {
        "fill-color": ["get", "background-color"],
        "fill-opacity": ["get", "opacity"],
      },
    },
    {
      id: "ehh-layer-line",
      source: SOURCE,
      type: "line",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["!has", "outline"],
        ["!=", "meta", "title"],
        ["!=", "meta", "route-line"],
      ],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": ["get", "background-color"],
        // 'line-width': ['get', 'line-width'],
        // 'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0, 19, ['get', 'line-width']],
        "line-width": ["case", ["has", "line-width"], ["get", "line-width"], 3],
        "line-opacity": ["get", "opacity"],
        "line-gap-width": [
          "case",
          ["to-boolean", "line-gap-width"],
          ["get", "line-gap-width"],
          0,
        ],
      },
    },
    {
      id: "ehh-layer-route-line",
      source: SOURCE,
      type: "line",
      filter: [
        "all",
        ["==", "$type", "LineString"],
        ["!has", "outline"],
        ["!=", "meta", "title"],
        ["==", "meta", "route-line"],
      ],
      layout: {
        // 'line-cap': 'round',
        // 'line-join': 'round',
        "line-sort-key": ["get", "sort"],
      },
      paint: {
        "line-color": ["get", "background-color"],
        // 'line-width': ['get', 'line-width'],
        // 'line-width': ['interpolate', ['linear'], ['zoom'], 0, 0, 19, ['get', 'line-width']],
        "line-width": ["case", ["has", "line-width"], ["get", "line-width"], 3],
        "line-opacity": ["get", "opacity"],
        "line-gap-width": [
          "case",
          ["to-boolean", "line-gap-width"],
          ["get", "line-gap-width"],
          0,
        ],
        "line-dasharray": [2, 2],
      },
    },
    {
      id: "ehh-layer-point",
      source: SOURCE,
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "focus"]],
      layout: {
        // 'icon-allow-overlap': true,
        "icon-anchor": "bottom",
        "icon-image": ["get", "icon"],
        // 'icon-size': ['case', ['has', 'icon-size'], ['get', 'icon-size'], 1],
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.3,
          19,
          ["coalesce", ["get", "icon-size"], 1],
        ],
      },
      paint: {},
    },
    {
      id: "ehh-layer-text",
      source: SOURCE,
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "title"]],
      minzoom: 8,
      maxzoom: 24,
      layout: {
        "icon-anchor": "bottom",
        "icon-image": ["get", "icon"],
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.3,
          19,
          ["coalesce", ["get", "icon-size"], 1],
        ],
        "text-field": ["get", "name"],
        // TODO 尚有问题
        // 'text-offset': ['literal', [0, ['+', ['*', ['floor', ['/', ['length', ['get', 'name']], 10]], 0.5], 1]]],
        "text-offset": ["get", "text-offset"],
        "text-size": 14,
        // 'text-size': ['interpolate', ['linear'], ['zoom'], 10, 0.01, 14, 14],
      },
      paint: {
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },
    {
      id: "ehh-layer-line-text",
      source: SOURCE,
      type: "symbol",
      filter: ["all", ["==", "$type", "LineString"], ["==", "meta", "title"]],
      minzoom: 8,
      maxzoom: 24,
      layout: {
        "text-field": ["get", "name"],
        // 'text-allow-overlap': true,
        "symbol-placement": "line-center",
        "text-offset": [0, 1],
        "icon-ignore-placement": true,
        "text-ignore-placement": false,
        "text-letter-spacing": 0.01,
        "text-size": 14,
      },
      paint: {
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },
    {
      id: "ehh-layer-focus",
      source: SOURCE,
      type: "symbol",
      filter: ["all", ["==", "$type", "Point"], ["==", "meta", "focus"]],
      layout: {
        "icon-allow-overlap": true,
        "icon-anchor": "bottom",
        "icon-image": ["case", ["has", "icon"], ["get", "icon"], "focus"],
        "icon-offset": [0, 3],
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          0,
          0.3,
          19,
          ["coalesce", ["get", "icon-size"], 1],
        ],
        "text-field": ["get", "name"],
        "text-offset": ["get", "text-offset"],
        "text-size": 14,
      },
      paint: {
        "text-halo-color": "#fff",
        "text-halo-width": 1,
      },
    },
  ];

  /**
   * name-名字 icon-图标
   */
  iconList = [];

  constructor({ map }) {
    super();
    this.map = map;
  }

  getMap() {
    return this.map;
  }

  init() {
    this.addSource();
  }

  destroy() {
    this.removeSource();
  }

  getTitleFeature(feature) {
    if (feature.geometry.type === "Polygon") {
      return centerOfMass(feature, {
        properties: {
          ...feature.properties,
          name: feature.properties.name,
          meta: "title",
          icon: feature.properties.featureType,
          "text-offset": this.getOffset(feature.properties.name),
        },
      });
    } else if (feature.geometry.type === "LineString") {
      const _length = feature.geometry.coordinates.length;
      const properties = {
        ...feature.properties,
        name: feature.properties.name,
        meta: "title",
      };

      return feature.geometry.coordinates.map((coordinate, index) => {
        if (index === _length - 1) {
          return {};
        } else {
          const nextCoordinate = feature.geometry.coordinates[index + 1];

          return lineString([coordinate, nextCoordinate], properties);
        }
      });
    } else if (feature.geometry.type === "Point") {
      return cloneDeep({
        ...feature,
        geometry: feature.geometry,
        properties: {
          name: feature.properties.name,
          meta: "title",
          "text-offset": this.getOffset(feature.properties.name),
        },
      });
    }
  }

  getOutLine(feature) {
    if (feature.geometry.type === "Polygon") {
      return polygonToLine(feature, {
        properties: {
          outline: feature.properties["background-color"],
          "outline-width": feature.properties["outline-width"],
        },
      });
    }
  }

  addSource() {
    if (!this.map.getSource(SOURCE)) {
      this.map.addSource(SOURCE, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
    }

    this.layerList.forEach((layer) => {
      if (!this.map.getLayer(layer.id)) {
        this.map.addLayer(layer);
      }
    });

    this.addEvents();
    this.addIcon();
  }

  removeSource() {
    this.removeEvents();

    this.layerList.forEach((layer) => {
      if (this.map.getLayer(layer.id)) {
        this.map.removeLayer(layer.id);
      }
    });

    if (this.map.getSource(SOURCE)) {
      this.map.removeSource(SOURCE);
    }
  }

  addEvents() {
    this.map.on("click", "ehh-layer-fill", this.clickFun);
    this.map.on("click", "ehh-layer-line", this.clickFun);
    this.map.on("click", "ehh-layer-point", this.clickFun);
  }

  removeEvents() {
    this.map.off("click", "ehh-layer-fill", this.clickFun);
    this.map.off("click", "ehh-layer-line", this.clickFun);
    this.map.off("click", "ehh-layer-point", this.clickFun);
  }

  addIcon() {
    this.iconList.forEach((item) => {
      this.map.loadImage(item.icon, (err, image) => {
        if (err) throw err;
        if (!this.map.hasImage(item.name)) {
          this.map.addImage(item.name, image);
        }
      });
    });
  }

  _click(e) {
    const feature = e.features[0];
    this.emit("click", feature, feature.properties.featureType, e);
  }

  _draw(features) {
    if (features.length === 0) {
      this.map.getSource(SOURCE).setData({
        type: "FeatureCollection",
        features: [],
      });
      return;
    }

    const showFeatures = features.filter((item) => item.properties.visible);

    const titleFeature = showFeatures
      .map((item) => this.getTitleFeature(item))
      .flat(1)
      .filter((item) => !validatenull(item));

    const outlineFeature = showFeatures
      .map((item) => this.getOutLine(item))
      .filter((item) => !validatenull(item));

    const collection = featureCollection([
      ...showFeatures,
      ...titleFeature,
      ...outlineFeature,
    ]);
    this.map.getSource(SOURCE).setData(collection);
  }

  set(feature) {
    set(this.layerData, feature.id, feature);
  }

  hide(val) {
    const _features = Object.values(this.layerData);
    _features.forEach((feature) => {
      if (feature.properties.featureType === val) {
        feature.properties.visible = false;
      }
    });

    this._draw(_features);
  }

  showById(id) {
    const features = Object.values(this.layerData);
    features.forEach((feature) => {
      if (feature.properties.id === id) {
        feature.properties.visible = true;
      }
    });

    this._draw(features);
  }

  hideById(id) {
    const features = Object.values(this.layerData);
    features.forEach((feature) => {
      if (feature.properties.id === id) {
        feature.properties.visible = false;
      }
    });

    this._draw(features);
  }

  getFeature(id) {
    const GeoJSON = this.map.getSource(SOURCE)._data;
    return GeoJSON.features.find((item) => item.id === id);
  }

  setFocus(feature, type) {
    const GeoJSON = this.map.getSource(SOURCE)._data;

    const i = GeoJSON.features.findIndex(
      (item) => item.properties.featureType === "focus",
    );
    if (i !== -1) {
      GeoJSON.features.splice(i, 1);
    }

    if (!validatenull(feature)) {
      const focusFeature = this.getTitleFeature(feature);
      this.map.getSource(SOURCE).setData({
        type: "FeatureCollection",
        features: [
          ...GeoJSON.features,
          {
            id: Date.now(),
            geometry: focusFeature.geometry,
            properties: {
              name: focusFeature.properties.name,
              "text-offset": focusFeature.properties["text-offset"],
              featureType: "focus",
              meta: "focus",
              icon: type ? `${type}-focus` : undefined,
            },
          },
        ],
      });
    } else {
      this.map.getSource(SOURCE).setData({
        type: "FeatureCollection",
        features: GeoJSON.features,
      });
    }
  }

  render(features) {
    if (features && Array.isArray(features) && features.length > 0) {
      this.changeVisible(features, true).forEach((feature) => {
        this.set(feature);
      });
    }

    const _features = cloneDeep(Object.values(this.layerData));
    this._draw(_features);
  }

  changeVisible(features, visible) {
    return features.map((feature) => {
      return {
        ...feature,
        properties: {
          ...feature.properties,
          visible: visible,
        },
      };
    });
  }

  getOffset(name) {
    const coefficient = Math.floor(name.length / 10);
    return [0, 1 + coefficient * 0.5];
  }
}

export default MapboxLayer;
