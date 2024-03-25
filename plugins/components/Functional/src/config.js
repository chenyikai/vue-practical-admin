import { MapboxPlotClass } from "@/plugins/composition/mapbox-plot";
import { MapboxToolsClass } from "@/plugins/composition/mapbox-tools";

const { MapboxDrawClass } = require("@/plugins/composition/mapbox-draw");

export const plotFuncList = [
  {
    id: 1,
    label: "点",
    icon: require("../assets/images/point.svg"),
    mode: MapboxDrawClass.DRAW_CUSTOM_POINT,
    options: {
      "graphical-type": MapboxPlotClass.POINT,
      "icon-image": "point", //图片名称  对应初始化时 icons中key
      "text-anchor": "top", //文字对齐方式
      "text-offset": [0, 0.5], //文字偏移量
      "icon-size": 1.5, //图标缩放倍数
      "text-color": "#000000", //文字颜色
      name: `点${Date.now()}`, //点位名称
      "text-size": 14, //文字大小
      "text-halo-width": 1, //文字描边宽度
      "text-halo-color": "#FFFFFF", //文字描边颜色
    },
  },
  {
    id: 2,
    label: "线",
    icon: require("../assets/images/line.svg"),
    mode: MapboxDrawClass.DRAW_LINE_STRING,
    options: {
      "graphical-type": MapboxPlotClass.LINE,
      name: `线${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "symbol-placement": "point", //文本位置方式
      "line-width": 2, //线宽
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-size": 14, //文本字体大小
      "text-halo-width": 1, //文本描边粗细
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "text-offset": [0, 0], //文本位移
    },
  },
  {
    id: 3,
    label: "面",
    icon: require("../assets/images/polygon.svg"),
    mode: MapboxDrawClass.DRAW_POLYGON,
    options: {
      "graphical-type": MapboxPlotClass.POLYGON,
      name: `多边形${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "text-size": 14, //文本字体大小
      "line-width": 2, //线宽
      "text-halo-width": 1, //文本描边粗细
      "text-offset": [0, 0], //文本位移
      "text-color": "#FF0000", //文本颜色
      "line-color": "#f00", //线颜色
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "fill-color": "#e600ff", //面填充色
      "fill-opacity": 0.1, //面透明度
    },
  },
  {
    id: 4,
    label: "圆",
    icon: require("../assets/images/circle.svg"),
    mode: MapboxDrawClass.DRAW_CIRCLE,
    options: {
      "graphical-type": MapboxPlotClass.CIRCLE,
      name: `圆${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "text-size": 14, //文本字体大小
      "line-width": 2, //线宽
      "text-halo-width": 1, //文本描边粗细
      "text-offset": [0, 0], //文本位移
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "fill-color": "#e600ff", //面填充色
      "fill-opacity": 0.1, //面透明度
    },
  },
];

export const toolFuncList = [
  {
    id: 1,
    label: "航道",
    icon: require("../assets/images/fence.svg"),
    type: "Fence",
    mode: MapboxDrawClass.DRAW_POLYGON,
    options: {
      "graphical-type": MapboxToolsClass.FENCE,
      name: `航道${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "text-size": 14, //文本字体大小
      "line-width": 2, //线宽
      "text-halo-width": 1, //文本描边粗细
      "text-offset": [0, 0], //文本位移
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "fill-color": "#f00", //面填充色
      "fill-opacity": 0.1, //面透明度
    },
  },
  {
    id: 2,
    label: "停报区域",
    icon: require("../assets/images/stop.svg"),
    type: "Stop",
    mode: MapboxDrawClass.DRAW_POLYGON,
    options: {
      "graphical-type": MapboxToolsClass.STOP,
      name: `停报区域${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "text-size": 14, //文本字体大小
      "line-width": 2, //线宽
      "text-halo-width": 1, //文本描边粗细
      "text-offset": [0, 0], //文本位移
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "fill-color": "#e600ff", //面填充色
      "fill-opacity": 0.1, //面透明度
    },
  },
  {
    id: 3,
    label: "航线绘制",
    icon: require("../assets/images/route.svg"),
    type: "Route",
    mode: MapboxDrawClass.DRAW_LINE_STRING,
    options: {
      "graphical-type": MapboxToolsClass.ROUTE,
      name: `航线${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "symbol-placement": "point", //文本位置方式
      "line-width": 2, //线宽
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-size": 14, //文本字体大小
      "text-halo-width": 1, //文本描边粗细
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "text-offset": [0, 0], //文本位移
    },
  },
  {
    id: 4,
    label: "区域回放",
    icon: require("../assets/images/playBack.svg"),
    type: "PlayBack",
    mode: MapboxDrawClass.DRAW_POLYGON,
    options: {
      "graphical-type": MapboxToolsClass.PLAY_BACK,
      name: `区域回放${Date.now()}`, //文本内容
      "text-anchor": "center", //文本对齐方式
      "text-size": 14, //文本字体大小
      "line-width": 2, //线宽
      "text-halo-width": 1, //文本描边粗细
      "text-offset": [0, 0], //文本位移
      "text-color": "#FF0000", //文本颜色
      "line-color": "#e600ff", //线颜色
      "text-halo-color": "#FFFFFF", //文本描边颜色
      "fill-color": "#e600ff", //面填充色
      "fill-opacity": 0.1, //面透明度
    },
  },
];

export const lengthList = [];
