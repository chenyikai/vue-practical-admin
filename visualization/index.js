import MapBox from "./module/Map/index.js";

/**
 * Mapbox实例
 * @type {Mapbox}
 */
let mapboxInstance = null;

export function init(options, callback) {
  mapboxInstance = new MapBox(options, (params) => {
    callback && callback(params);
  });
}

export { mapboxInstance as Mapbox };
