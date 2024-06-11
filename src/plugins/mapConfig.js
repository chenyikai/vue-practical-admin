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
  center: [122.19, 30.08],
  zoom: 9,
};

export const iconData = [
  {
    url: new URL("@/plugins/assets/focus.png", import.meta.url),
    name: "focus",
  },
  {
    url: new URL("@/plugins/assets/port.png", import.meta.url),
    name: "Port",
  },
  {
    url: new URL("@/plugins/assets/warn.png", import.meta.url),
    name: "warn",
  },
];

export const baseMap = [
  {
    id: 5,
    name: "海陆图",
    img: new URL("@/plugins/assets/seamap.png", import.meta.url),
    paramsList: [
      {
        name: "landSea",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e
        2a
        `,
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
    img: new URL("@/plugins/assets/electronicmap.png", import.meta.url),
    paramsList: [
      {
        name: "sea1",
        type: "raster",
        tiles: [
          "https://seamap.ehanghai.cn/ehhht/{z}/{y}/{x}.png?appKey=5f8ed51cbff748a98a8224748f361e2a",
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
    img: new URL("@/plugins/assets/satellitemap.png", import.meta.url),
    paramsList: [
      {
        name: "satellite",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
    img: new URL("@/plugins/assets/roadmap.png", import.meta.url),
    paramsList: [
      {
        name: "land",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
    img: new URL("@/plugins/assets/satellitemap.png", import.meta.url),
    paramsList: [
      {
        name: "satelliteSea",
        type: "raster",
        tiles: [
          `https://tianditu.ehanghai.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
          `https://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=5f8ed51cbff748a98a8224748f361e2a`,
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
          "https://seamap.ehanghai.cn/qghlt-zld/{z}/{y}/{x}.png?appKey=5f8ed51cbff748a98a8224748f361e2a",
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
