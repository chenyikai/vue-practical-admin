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
  center: [122.106863, 30.016028],
  zoom: 13,
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
          `http://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
        name: "landSea1",
        type: "raster",
        tiles: [
          `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
        name: "landSea2",
        type: "raster",
        tiles: ["http://pngchart.ehanghai.cn/zqyhlt/{z}/{y}/{x}.png"],
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
    id: 2,
    name: "海图",
    img: seamap,
    paramsList: [
      {
        name: "sea",
        type: "raster",
        tiles: ["http://nas.ehanghai.cn:90/{z}/{y}/{x}.png"],
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
        name: "sea1",
        type: "raster",
        tiles: ["http://pngchart.ehanghai.cn/ehhht/{z}/{y}/{x}.png"],
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
          `http://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
          `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
          `http://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
          `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
          `http://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
        ],
        tileSize: 256,
        maxzoom: 17,
        layer: {
          type: "raster",
          paint: {},
          layout: {
            visibility: "visible",
          },
        },
      },
      {
        name: "satelliteSea1",
        type: "raster",
        tiles: [
          `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
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
        name: "satelliteSea2",
        type: "raster",
        tiles: ["/tileset/yisheng/{z}/{x}/{y}.png"],
        tileSize: 256,
        maxzoom: 17,
        minzoom: 15,
        bounds: [121.61699569, 31.34550567, 121.627033, 31.3541081],
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
];
