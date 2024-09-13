import { lineString, length, along } from "@turf/turf";
import { validatenull } from "@/utils/validate.js";
import { set } from "lodash";

export default () => {
  const marks = {};
  const running = [];
  const steps = 500;

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

  function setMarker(options) {
    return new Promise((resolve, reject) => {
      if (isUpdate(options.id)) {
        updateMarker(options)
          .then(() => resolve())
          .catch((e) => reject(e));
      } else {
        addMarker(options);
      }
    });
  }

  function addMarker(mark) {
    const { id, lon, lat, element } = mark;
    const marker = new Marker({ element }).setLngLat([lon, lat]).addTo(map);

    marks[id] = {
      id, // 唯一值
      value: mark, // 数据
      marker, // Marker实例
      start: [lon, lat], // 起始点
      mid: null, // 中途点
      end: null, // 结束点
      route: null, // 移动路劲
      path: [], // 真实路径
      distance: null, // 距离
      count: 0, // 计数
      animate: null, // 动画Id
      success: () => {},
      fail: () => {},
    };
  }

  function deleteMarker(id) {
    const val = getMark(id);
    // 未新增的数据 不予理睬
    if (!val) return;

    if (val["animate"]) {
      window.cancelAnimationFrame(val["animate"]);
    }

    if (val["marker"]) {
      val["marker"].remove();
    }

    if (!validatenull(val)) {
      delete marks[id];
    }
  }

  function updateMarker(mark) {
    return new Promise((resolve, reject) => {
      const { id, lon, lat } = mark;
      if (isRunning(id)) {
        marks[id]["path"].push([lon, lat]);
        setMark(id, "success", resolve);
        setMark(id, "fail", reject);
        return;
      }

      const { start } = getMark(id);
      // 点位一样 不做动画
      if (start[0] === lon && start[1] === lat) return;

      const { route, distance } = getAnimateParams([start, [lon, lat]]);

      setMark(id, "route", route);
      setMark(id, "distance", distance);
      setMark(id, "end", [lon, lat]);

      addRunning(id);
      animate(id, resolve, reject);
    });
  }

  function getAnimateParams(points) {
    const path = lineString(points);
    const distance = length(path);
    const arc = [];

    for (let i = 0; i < distance; i += distance / steps) {
      const segment = along(path, i);
      arc.push(segment.geometry.coordinates);
    }

    const route = lineString(arc);

    return { route, distance };
  }

  function animate(id, resolve, reject) {
    try {
      const { marker, route, count, end } = getMark(id);
      const lngLat = route.geometry.coordinates[count];
      setMark(id, "mid", lngLat);

      marker.setLngLat(lngLat);
      if (count < steps - 1) {
        const fn = animate.bind(this, id, resolve, reject);
        setMark(id, "animate", window.requestAnimationFrame(fn));
      } else {
        setMark(id, "start", end);
        setMark(id, "mid", null);
        setMark(id, "end", null);
        setMark(id, "route", null);
        setMark(id, "distance", null);
        setMark(id, "count", 0);
        setMark(id, "animate", null);
        setMark(id, "success", () => {});
        setMark(id, "fail", () => {});

        if (hasTask(id)) {
          const { start, path, success, fail } = getMark(id);
          const { route, distance } = getAnimateParams([start, ...path]);
          const [lon, lat] = path.at(-1);

          setMark(id, "route", route);
          setMark(id, "distance", distance);
          setMark(id, "end", [lon, lat]);
          setMark(id, "path", []);
          animate(id, success, fail);
        } else {
          deleteRunning(id);
        }
        resolve && resolve();
      }

      marks[id]["count"] += 1;
    } catch (e) {
      reject(e);
    }
  }

  function isRunning(id) {
    const index = running.indexOf(id);
    return index !== -1;
  }

  function addRunning(id) {
    running.push(id);
  }

  function deleteRunning(id) {
    const index = running.indexOf(id);
    if (index !== -1) {
      running.splice(index, 1);
    }
  }

  function setMark(id, key, value) {
    set(marks[id], key, value);
  }

  function getMark(id) {
    return marks[id];
  }

  function isUpdate(id) {
    const mark = getMark(id);
    return !validatenull(mark);
  }

  function hasTask(id) {
    const { path } = getMark(id);
    return Array.isArray(path) && path.length > 0;
  }

  return {
    init,
    isUpdate,
    setMarker,
    addMarker,
    addMarkers,
    deleteMarker,
    updateMarker,
  };
};
