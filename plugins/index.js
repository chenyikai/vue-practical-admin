import Mapbox from "./composition/Map/mapbox.js";
import MapboxDraw from "./composition/Draw/mapbox-draw.js";
import MapboxLayer from "./composition/mapbox-layer.js";
import MapboxSwitch from "./composition/mapbox-switch.js";
import MapboxTrack from "./composition/Track/index.js";
import MapboxShip from "./composition/Ship/index.js";
import "./composition/Ship/index.scss";
import { cloneDeep } from "lodash";
import { baseMap } from "./mapConfig.js";

/**
 * Mapbox实例
 * @type {Mapbox}
 */
let mapboxInstance = null;

/**
 * MapboxLayer实例
 * @type {MapboxLayer}
 */
let mapboxLayerInstance = null;

/**
 * MapboxDraw实例
 * @type {MapboxDraw}
 */
let mapboxDrawInstance = null;

/**
 * MapboxSwitch实例
 * @type {null}
 */
let mapboxSwitchInstance = null;

/**
 * MapboxTrack实例
 * @type {MapboxTrack}
 */
let mapboxTrackInstance = null;

/**
 * MapboxTrack实例
 * @type {MapboxShip}
 */
let mapboxShipInstance = null;

function addDraw({ map, ehhGis }) {
  if (mapboxDrawInstance) return;

  const draw = new ehhGis.Draw({
    displayControlsDefault: false, //是否使用默认控件
    controls: false, //是否显示单个控件
    boxSelect: false, //是否启用shift+ click+拖动功能框选择, 若为false,shift+ click+拖动放大一个区域
    icons: {},
  });
  map.addControl(draw);

  const options = {
    map,
    ehhGis,
    draw,
  };

  mapboxDrawInstance = new MapboxDraw(options);
  mapboxLayerInstance = new MapboxLayer(options);
}

function addSwitch({ map, ehhGis }) {
  const options = {
    map,
    mapSwitch: new ehhGis.MapLayerSwitch(map, cloneDeep(baseMap)),
  };
  mapboxSwitchInstance = new MapboxSwitch(options);
}

function addTrack({ map }) {
  mapboxTrackInstance = new MapboxTrack(map);
  mapboxTrackInstance.init();
}

function addShip({ map, ehhGis }) {
  mapboxShipInstance = new MapboxShip({
    map,
    ehhGis,
    ship: new ehhGis.Ship({ map }),
  });
}

/**
 *
 * @param options { MapboxOptions }
 * @param callback
 */
export default function init(options, callback) {
  mapboxInstance = new Mapbox(options, (params) => {
    addSwitch(params);
    addDraw(params);
    addTrack(params);
    addShip(params);

    callback && callback();
  });
}

export {
  mapboxInstance as Mapbox,
  mapboxLayerInstance as MapboxLayer,
  mapboxDrawInstance as MapboxDraw,
  mapboxSwitchInstance as MapboxSwitch,
  mapboxTrackInstance as MapboxTrack,
  mapboxShipInstance as MapboxShip,
};
