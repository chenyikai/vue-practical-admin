import { lineString, length, along } from "@turf/turf";
import { validatenull } from "@/utils/validate";
import { set } from "lodash-es";

interface MarkerInput {
  id: string | number;
  lon: number;
  lat: number;
  element?: HTMLElement;
}

interface MarkEntry {
  id: string | number;
  value: MarkerInput;
  marker: unknown;
  start: [number, number];
  mid: [number, number] | null;
  end: [number, number] | null;
  route: ReturnType<typeof lineString> | null;
  path: [number, number][];
  distance: number | null;
  count: number;
  animate: number | null;
  success: () => void;
  fail: (reason?: unknown) => void;
}

interface InitOptions {
  Marker: new (opts: { element?: HTMLElement }) => { setLngLat(coords: [number, number]): { addTo(map: unknown): unknown }; setLngLat(coords: [number, number]): unknown; remove(): void };
  map: unknown;
}

export default (): {
  init: (options: InitOptions) => void;
  isUpdate: (id: string | number) => boolean;
  addMarker: (mark: MarkerInput) => void;
  addMarkers: (list: MarkerInput[]) => void;
  deleteMarker: (id: string | number) => void;
  updateMarker: (mark: MarkerInput) => Promise<void>;
} => {
  const marks: Record<string | number, MarkEntry> = {};
  const running: (string | number)[] = [];
  const steps = 500;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MarkerClass: any = null;
  let map: unknown = null;

  function init(options: InitOptions): void {
    MarkerClass = options.Marker;
    map = options.map;
  }

  function addMarkers(list: MarkerInput[]): void {
    list.forEach((mark) => addMarker(mark));
  }

  function addMarker(mark: MarkerInput): void {
    const { id, lon, lat, element } = mark;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const marker = new MarkerClass({ element }).setLngLat([lon, lat]).addTo(map) as unknown;

    marks[id] = {
      id,
      value: mark,
      marker,
      start: [lon, lat],
      mid: null,
      end: null,
      route: null,
      path: [],
      distance: null,
      count: 0,
      animate: null,
      success: () => {},
      fail: () => {},
    };
  }

  function deleteMarker(id: string | number): void {
    const val = getMark(id);
    if (!val) return;

    if (val.animate) {
      window.cancelAnimationFrame(val.animate);
    }

    if (val.marker) {
      (val.marker as { remove(): void }).remove();
    }

    if (!validatenull(val)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete marks[id];
    }
  }

  function updateMarker(mark: MarkerInput): Promise<void> {
    return new Promise((resolve, reject) => {
      const { id, lon, lat } = mark;
      if (isRunning(id)) {
        const entry = getMark(id);
        if (entry) {
          entry.path.push([lon, lat]);
          setMark(id, "success", resolve);
          setMark(id, "fail", reject);
        }
        return;
      }

      const entry = getMark(id);
      if (!entry) return;

      const { start } = entry;
      const { route, distance } = getAnimateParams([start, [lon, lat]]);

      setMark(id, "route", route);
      setMark(id, "distance", distance);
      setMark(id, "end", [lon, lat]);

      addRunning(id);
      animate(id, resolve, reject);
    });
  }

  function getAnimateParams(points: [number, number][]): { route: ReturnType<typeof lineString>; distance: number } {
    const path = lineString(points);
    const distance = length(path);
    const arc: number[][] = [];

    for (let i = 0; i < distance; i += distance / steps) {
      const segment = along(path, i);
      arc.push(segment.geometry.coordinates);
    }
    const route = lineString(arc);

    return { route, distance };
  }

  function animate(id: string | number, resolve: () => void, reject: (reason?: unknown) => void): void {
    try {
      const entry = getMark(id);
      if (!entry) return;

      const { marker, route, count, end } = entry;
      const lngLat = route?.geometry.coordinates[count] as [number, number] | undefined;
      if (!lngLat) return;

      setMark(id, "mid", lngLat);
      (marker as { setLngLat(coords: [number, number]): void }).setLngLat(lngLat);

      if (count < steps - 1) {
        const fn = (): void => {
          animate(id, resolve, reject);
        };
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
          const taskEntry = getMark(id);
          if (taskEntry) {
            const { start, path, success, fail } = taskEntry;
            const lastPoint = path.at(-1);
            if (lastPoint) {
              const { route: newRoute, distance: newDistance } = getAnimateParams([start, ...path]);
              const [lon, lat] = lastPoint;

              setMark(id, "route", newRoute);
              setMark(id, "distance", newDistance);
              setMark(id, "end", [lon, lat]);
              setMark(id, "path", []);
              animate(id, success, fail);
            }
          }
        } else {
          deleteRunning(id);
        }
        resolve();
      }

      marks[id]!.count += 1;
    } catch (e) {
      reject(e);
    }
  }

  function isRunning(id: string | number): boolean {
    return running.indexOf(id) !== -1;
  }

  function addRunning(id: string | number): void {
    running.push(id);
  }

  function deleteRunning(id: string | number): void {
    const index = running.indexOf(id);
    if (index !== -1) {
      running.splice(index, 1);
    }
  }

  function setMark(id: string | number, key: string, value: unknown): void {
    const entry = marks[id];
    if (entry) {
      set(entry, key, value);
    }
  }

  function getMark(id: string | number): MarkEntry | undefined {
    return marks[id];
  }

  function isUpdate(id: string | number): boolean {
    const mark = getMark(id);
    return !validatenull(mark);
  }

  function hasTask(id: string | number): boolean {
    const entry = getMark(id);
    if (!entry) return false;
    const { path } = entry;
    return Array.isArray(path) && path.length > 0;
  }

  return {
    init,
    isUpdate,
    addMarker,
    addMarkers,
    deleteMarker,
    updateMarker,
  };
};
