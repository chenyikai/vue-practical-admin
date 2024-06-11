import Mapbox from "./composition/mapbox.js";
import MapboxDraw from "./composition/mapbox-draw.js";
import MapboxLayer from "./composition/mapbox-layer.js";
import MapboxSwitch from "./composition/mapbox-switch.js";
import { cloneDeep } from "lodash";
import { baseMap } from "./mapConfig.js";
import { setStore } from "@/utils/store";
import point from "@/plugins/assets/plot/point.png";
import bianjian from "@/icons/mapIcon/bianjian.png";
import bowei from "@/icons/mapIcon/bowei.png";
import chuanbodaili from "@/icons/mapIcon/chuanbodaili.png";
import chuanboweixiu from "@/icons/mapIcon/chuanboweixiu.png";
import chuangonggongsi from "@/icons/mapIcon/chuangonggongsi.png";
import chuanwu from "@/icons/mapIcon/chuanwu.png";
import gangwubumen from "@/icons/mapIcon/gangwubumen.png";
import gongyoufuwu from "@/icons/mapIcon/gongyoufuwu.png";
import haiguan from "@/icons/mapIcon/haiguan.png";
import haishi from "@/icons/mapIcon/haishi.png";
import matou from "@/icons/mapIcon/matou.png";
import nengyuanqiye from "@/icons/mapIcon/nengyuanqiye.png";
import tushuziliao from "@/icons/mapIcon/tushuziliao.png";
import yingji from "@/icons/mapIcon/yingji.png";
import yugang from "@/icons/mapIcon/yugang.png";
import yuye from "@/icons/mapIcon/yuye.png";
import zaochuanqiye from "@/icons/mapIcon/zaochuanqiye.png";

let mapboxInstance = null;

let mapboxLayerInstance = null;

let mapboxDrawInstance = null;

let mapboxSwitchInstance = null;

function addDraw({ map, ehhGis }) {
  if (mapboxDrawInstance) return;

  const draw = new ehhGis.Draw({
    displayControlsDefault: false, //是否使用默认控件
    controls: false, //是否显示单个控件
    boxSelect: false, //是否启用shift+ click+拖动功能框选择, 若为false,shift+ click+拖动放大一个区域
    icons: {
      point: {
        url: point,
      },
      bianjian: {
        url: bianjian,
      },
      bowei: {
        url: bowei,
      },
      chuanbodaili: {
        url: chuanbodaili,
      },
      chuanboweixiu: {
        url: chuanboweixiu,
      },
      chuangonggongsi: {
        url: chuangonggongsi,
      },
      chuanwu: {
        url: chuanwu,
      },
      gangwubumen: {
        url: gangwubumen,
      },
      gongyoufuwu: {
        url: gongyoufuwu,
      },
      haiguan: {
        url: haiguan,
      },
      haishi: {
        url: haishi,
      },
      matou: {
        url: matou,
      },
      nengyuanqiye: {
        url: nengyuanqiye,
      },
      tushuziliao: {
        url: tushuziliao,
      },
      yingji: {
        url: yingji,
      },
      yugang: {
        url: yugang,
      },
      yuye: {
        url: yuye,
      },
      zaochuanqiye: {
        url: zaochuanqiye,
      },
    },
  });
  map.addControl(draw);

  const options = {
    map,
    ehhGis,
    draw,
  };

  mapboxDrawInstance = new MapboxDraw(options);
  mapboxLayerInstance = new MapboxLayer(options);
}

function addSwitch({ map, ehhGis }, query) {
  let { mrty } = query;
  let arr = [...baseMap];
  let Index = arr.findIndex((item) => item.id == 5);
  let obj = arr[Index];
  obj.paramsList = obj.paramsList.map((item) => {
    item.layer.layout.visibility = "none";
    return {
      ...item,
    };
  });
  if (mrty) {
    let Index = arr.findIndex((item) => item.id == mrty);
    let obj = arr[Index];
    obj.paramsList = obj.paramsList.map((item) => {
      item.layer.layout.visibility = "visible";
      return item;
    });
    arr.splice(Index, 1);
    arr.unshift(obj);
  }
  const options = {
    map,
    mapSwitch: new ehhGis.MapLayerSwitch(map, arr),
  };
  mapboxSwitchInstance = new MapboxSwitch(options);
}

export default function init(options, callback) {
  mapboxInstance = new Mapbox(options, (params) => {
    addSwitch(params, options);
    addDraw(params);
    callback && callback();
  });
}

export {
  mapboxInstance as Mapbox,
  mapboxLayerInstance as MapboxLayer,
  mapboxDrawInstance as MapboxDraw,
  mapboxSwitchInstance as MapboxSwitch,
};
