import { PREFIX } from "./vars.js";

export const HOT = "hot";
export const COLD = "cold";

export const SOURCES = {
  HOT: `${PREFIX}-plot-source-${HOT}}`,
  COLD: `${PREFIX}-plot-source-${COLD}}`,
};

export const LAYERS = {
  HOT: {
    POINT_LAYER: `${PREFIX}-point-layer-${HOT}`,
  },
  COLD: {
    POINT_LAYER: `${PREFIX}-point-layer-${COLD}`,
  },
};

export const HOT_LAYER = [];

export const COLD_LAYER = [
  {
    id: LAYERS.COLD.POINT_LAYER,
    type: "symbol",
    filter: ["all", ["==", "$type", "Point"]],
    layout: {
      "text-allow-overlap": false,
      "icon-allow-overlap": true,
      "text-field": ["get", "name"],
      "text-anchor": ["coalesce", ["get", "text-anchor"], "left"],
      "text-line-height": 1,
      "text-size": ["coalesce", ["get", "text-size"], 14],
      "text-justify": "center",
      "text-offset": [
        "case",
        ["to-boolean", ["get", "text-offset"]],
        ["get", "text-offset"],
        [
          "match",
          ["get", "text-anchor"],
          "left",
          ["literal", [0.6, 0]],
          "right",
          ["literal", [-0.6, 0]],
          "top",
          ["literal", [0, 0.6]],
          "bottom",
          ["literal", [0, -0.6]],
          ["literal", [0, 0]],
        ],
      ],
      "icon-image": ["concat", "mapbox-gl-draw-", ["get", "icon-image"]],
      "icon-anchor": ["coalesce", ["get", "icon-anchor"], "bottom"],
      "icon-size": [
        "interpolate",
        ["linear"],
        ["zoom"],
        0,
        0.01,
        19,
        ["coalesce", ["get", "icon-size"], 1],
      ],
    },
    paint: {
      "text-color": ["coalesce", ["get", "text-color"], "#FF0000"],
      "text-halo-width": ["coalesce", ["get", "text-halo-width"], 1],
      "text-halo-color": ["coalesce", ["get", "text-halo-color"], "#FFFFFF"],
      "text-halo-blur": ["get", "text-halo-blur"],
    },
  },
];
