import { COLORS, SOURCES } from "./Constants";

export default [
  {
    id: "ehh-route-draw.line",
    type: "line",
    source: SOURCES.DEFAULT,
    filter: ["all", ["==", "$type", "LineString"]],
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-width": 2,
      "line-color": COLORS.LINE,
    },
  },
  {
    id: "ehh-route-draw.end-point",
    type: "circle",
    source: SOURCES.DEFAULT,
    filter: ["all", ["==", "$type", "Point"], ["==", "type", "endpoint"]],
    paint: {
      "circle-radius": 8,
      "circle-color": COLORS.POINT,
      "circle-stroke-width": 2,
      "circle-stroke-color": COLORS.LINE,
    },
  },
  {
    id: "ehh-route-draw.end-point-text",
    type: "symbol",
    source: SOURCES.DEFAULT,
    filter: ["all", ["==", "$type", "Point"], ["==", "type", "endpoint"]],
    paint: {
      "text-color": COLORS.POINT_TEXT,
    },
    layout: {
      "text-field": ["get", "$index"],
      "text-size": 10,
      "text-allow-overlap": true,
    },
  },
  {
    id: "ehh-route-draw.bearing-text",
    type: "symbol",
    source: SOURCES.DEFAULT,
    filter: ["all", ["==", "$type", "Point"], ["==", "type", "center"]],
    paint: {
      "text-color": COLORS.LINE,
    },
    layout: {
      "text-field": ["get", "bearingText"],
      "text-rotate": ["get", "textBearing"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 0, 0.6, 24, 24],
      "text-anchor": "top",
      "text-allow-overlap": true,
      "text-offset": [0, 0.5],
    },
  },
  {
    id: "ehh-route-draw.distance-text",
    type: "symbol",
    source: SOURCES.DEFAULT,
    filter: ["all", ["==", "$type", "Point"], ["==", "type", "center"]],
    paint: {
      "text-color": COLORS.LINE,
    },
    layout: {
      "text-field": ["get", "distanceText"],
      "text-rotate": ["get", "textBearing"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 0, 0.6, 24, 24],
      "text-anchor": "bottom",
      "text-allow-overlap": true,
      "text-offset": [0, -0.5],
    },
  },
];
