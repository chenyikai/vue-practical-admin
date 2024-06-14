import focus from "./assets/focus.png";
import port from "./assets/port.png";
import warn from "./assets/warn.png";
import electronicmap from "./assets/electronicmap.png";
import seamap from "./assets/seamap.png";
import satellitemap from "./assets/satellitemap.png";
import roadmap from "./assets/roadmap.png";

export const mapConfig = {
  container: "map",
  style: {
    version: 8,
    name: "Basic",
    glyphs: "https://objects.aochensoft.com/oss/{fontstack}/{range}.pbf",
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "rgba(212,234,238,1)",
        },
      },
    ],
  },
  center: [121.786863, 31.316028],
  zoom: 11,
};

export const iconData = [
  {
    url: focus,
    name: "focus",
  },
  {
    url: port,
    name: "Port",
  },
  {
    url: warn,
    name: "warn",
  },
];

export const baseMap = [
  {
    id: 5,
    name: "海陆图",
    img: electronicmap,
    paramsList: [
      {
        name: "landSea",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "visible",
          },
        },
      },
      {
        name: "landSea1",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "visible",
          },
        },
      },
      {
        name: "landSea2",
        type: "raster",
        tiles: [
          "https://seamap.ehanghai.cn/quanguohlt/{z}/{y}/{x}.png?appKey=sqm8vc2747a411eda8dc00163e0rtbbs",
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "visible",
          },
        },
      },
    ],
  },
  {
    id: 2,
    name: "海图",
    img: seamap,
    paramsList: [
      {
        name: "sea1",
        type: "raster",
        tiles: [
          "https://seamap.ehanghai.cn/ehhht/{z}/{y}/{x}.png?appKey=ec021f83c8b14084b90726dbb120e307",
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
    ],
  },
  {
    id: 3,
    name: "卫星图",
    img: satellitemap,
    paramsList: [
      {
        name: "satellite",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
      {
        name: "satellite1",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
    ],
  },
  {
    id: 4,
    name: "地图",
    img: roadmap,
    paramsList: [
      {
        name: "land",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
      {
        name: "land1",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
    ],
  },
  {
    id: 6,
    name: "影像图",
    img: satellitemap,
    paramsList: [
      {
        name: "satelliteSea",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
      {
        name: "satelliteSea1",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=ec021f83c8b14084b90726dbb120e307`,
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
      {
        name: "satelliteSea2",
        type: "raster",
        tiles: [
          "https://seamap.ehanghai.cn/qghlt-zld/{z}/{y}/{x}.png?appKey=ec021f83c8b14084b90726dbb120e307",
        ],
        tileSize: 256,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "none",
          },
        },
      },
    ],
  },
];
