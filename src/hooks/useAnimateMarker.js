import { ref } from "vue";
import { lineString, length } from "@turf/turf";
import * as turf from "@turf/turf";
import { validatenull } from "@/utils/validate.js";
import { cloneDeep } from "lodash";

export default () => {
  const marks = ref({});
  const running = ref([]);
  const steps = 1000;

  /**
   *
   * @type { mapboxgl.Marker }}
   */
  let Marker = null;
  /**
   *
   * @type { mapboxgl.Map }
   */
  let map = null;

  function init(options) {
    Marker = options.Marker;
    map = options.map;
  }

  /**
   *
   * @param list
   */
  function addMarkers(list) {
    list.forEach((mark) => addMarker(mark));
  }

  function addMarker(mark) {
    const { id, lon, lat } = mark;
    const marker = new Marker().setLngLat([lon, lat]).addTo(map);

    marks.value[id] = {
      id,
      value: mark,
      marker,
      start: [lon, lat],
      mid: null,
      turn: [],
      end: null,
      route: null,
      distance: null,
      count: 0,
      animate: null,
    };
  }

  function deleteMarker(mark) {
    const { id } = mark;
    const val = marks.value[id];

    if (!validatenull(val)) {
      delete marks.value[id];
    }
  }

  function updateMarker(mark) {
    return new Promise((resolve, reject) => {
      const { id, lon, lat } = mark;
      if (isRunning(id)) {
        window.cancelAnimationFrame(marks.value[id]["animate"]);
        marks.value[id]["animate"] = null;

        const { mid: newStart, end: turn } = marks.value[id];
        marks.value[id]["turn"].push(cloneDeep(turn));

        const { route: r, distance: d } = getAnimateParams({
          start: newStart,
          turn: marks.value[id]["turn"],
          end: [lon, lat],
        });

        marks.value[id]["route"] = r;
        marks.value[id]["distance"] = d;
        marks.value[id]["end"] = [lon, lat];

        animate(id, resolve, reject);
        return;
      }

      const { start } = marks.value[id];

      const { route, distance } = getAnimateParams({ start, end: [lon, lat] });

      marks.value[id]["route"] = route;
      marks.value[id]["distance"] = distance;
      marks.value[id]["end"] = [lon, lat];

      addRunning(id);
      animate(id, resolve, reject);
    });
  }

  function getAnimateParams({ start, turn, end }) {
    const route = getRoute({ start, turn, end });
    const distance = length(route);
    const arc = [];

    for (let i = 0; i < distance; i += distance / steps) {
      const segment = turf.along(route, i);
      arc.push(segment.geometry.coordinates);
    }
    route.geometry.coordinates = arc;

    return { route, distance };
  }

  /**
   *
   * @param start
   * @param turn
   * @param end
   * @return {Feature}
   */
  function getRoute({ start, turn, end }) {
    const points = [start, end];
    if (Array.isArray(turn) && turn.length > 0) {
      points.splice(1, 0, ...turn);
    }
    return lineString(
      points.filter((point) => Array.isArray(point) && point.length > 0),
    );
  }

  function animate(id, resolve, reject) {
    try {
      const { marker, route, count, end } = marks.value[id];
      const lngLat = route.geometry.coordinates[count];
      marks.value[id]["mid"] = lngLat;

      marker.setLngLat(lngLat);
      if (count < steps - 1) {
        const fn = animate.bind(this, id, resolve, reject);
        marks.value[id]["animate"] = window.requestAnimationFrame(fn);
      } else {
        window.cancelAnimationFrame(marks.value[id]["animate"]);
        marks.value[id]["start"] = end;
        marks.value[id]["end"] = null;
        marks.value[id]["route"] = null;
        marks.value[id]["distance"] = null;
        marks.value[id]["count"] = 0;
        marks.value[id]["animate"] = null;

        deleteRunning(id);
        resolve && resolve();
      }

      marks.value[id]["count"] += 1;
    } catch (e) {
      reject(e);
    }
  }

  function isRunning(id) {
    const index = running.value.indexOf(id);
    return index !== -1;
  }

  function addRunning(id) {
    running.value.push(id);
  }

  function deleteRunning(id) {
    const index = running.value.indexOf(id);
    if (index !== -1) {
      running.value.splice(index, 1);
    }
  }

  return {
    init,
    addMarker,
    addMarkers,
    deleteMarker,
    updateMarker,
  };
};
