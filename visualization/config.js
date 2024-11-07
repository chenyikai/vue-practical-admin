export const style = {
  version: 8,
  name: "Basic",
  glyphs: "http://nas.ehanghai.cn:90/fonts/{fontstack}/{range}.pbf",
  sources: {
    base: {
      tiles: [
        // "http://t0.tianditu.gov.cn/vec_w/wmts?tk=645d596e234d96fb5b919937f46c9a00",
        `http://tianditu.ehanghai.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
      ],
      type: "raster",
      tileSize: 256,
      minzoom: 0,
      maxzoom: 17,
    },
    label: {
      tiles: [
        // "http://t0.tianditu.gov.cn/cva_w/wmts?tk=645d596e234d96fb5b919937f46c9a00",
        `http://tianditu.ehanghai.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=468826a92a07c852cefab31f9bed06d4`,
      ],
      type: "raster",
      tileSize: 256,
      minzoom: 0,
      maxzoom: 217,
    },
  },
  layers: [
    {
      id: "base_layer",
      source: "base",
      type: "raster",
    },
    {
      id: "label_layer",
      source: "label",
      type: "raster",
    },
    {
      id: "base-end",
      type: "background",
      paint: {
        "background-color": "transparent",
      },
    },
  ],
};

export const iconData = [];
