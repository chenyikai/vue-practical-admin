<script>
export default {
  name: "MapBox",
};
</script>

<script setup>
import Mapbox from "@/plugins/composition/mapbox.js";
import MapboxSwitch from "@/plugins/composition/mapbox-switch.js";
import MapboxDraw from "@/plugins/composition/mapbox-draw.js";
import MapboxLayer from "@/plugins/composition/mapbox-layer.js";
import MapSwitch from "@/plugins/components/MapSwitch/src/index.vue";

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

import { mapStore } from "@/store/index.js";
import { baseMap } from "@/plugins/mapConfig.js";
import { onBeforeMount, ref, defineEmits } from "vue";
import { cloneDeep } from "lodash";
const map = ref(null);
const loading = ref(false);
const MapStore = mapStore();
const emit = defineEmits(["draw-data"]);

let mapbox = null;
let mapboxDraw = null;
let mapboxLayer = null;
let mapSwitchInstance = null;
// eslint-disable-next-line no-unused-vars
let control = null;

const customPoint = {
  "icon-image": "point", //图片名称  对应初始化时 icons中key
  "text-anchor": "top", //文字对齐方式
  "text-offset": [0, 0.5], //文字偏移量
  "icon-size": 1.5, //图标缩放倍数
  "text-color": "#FF0000", //文字颜色
  "text-size": 16, //文字大小
  "text-halo-width": 1, //文字描边宽度
  "text-halo-color": "#FFFFFF", //文字描边颜色
  featureType: "customPoint",
  name: "",
};
const lineString = {
  "text-anchor": "center", //文本对齐方式
  "symbol-placement": "point", //文本位置方式
  "line-width": 2, //线宽
  "text-color": "#FF0000", //文本颜色
  "line-color": "#e600ff", //线颜色
  "text-size": 14, //文本字体大小
  "text-halo-width": 1, //文本描边粗细
  "text-halo-color": "#FFFFFF", //文本描边颜色
  "text-offset": [0, 0], //文本位移
  featureType: "lineString",
  name: "",
};
const polygon = {
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
  featureType: "polygon",
  name: "",
};
const circle = {
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
  featureType: "circle",
  name: "",
};

function initMap(callback) {
  const options = {
    container: map.value,
  };
  mapbox = new Mapbox(options, (data) => {
    addDraw(data);
    addSwitch(data);
    addScale(data);
    loading.value = true;
    setTimeout(() => {
      mapbox.getMap().resize();
    }, 0);
    callback();
  });
}

function addScale({ map, ehhGis }) {
  const scale = new ehhGis.scale();
  control = map.addControl(scale, "bottom-left");
}

function addSwitch({ map, ehhGis }) {
  const options = {
    map,
    mapSwitch: new ehhGis.MapLayerSwitch(map, cloneDeep(baseMap)),
  };
  mapSwitchInstance = new MapboxSwitch(options);
}

function addDraw({ map, ehhGis }) {
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

  mapboxDraw = new MapboxDraw(options);
  mapboxLayer = new MapboxLayer(options);
  mapboxDraw.on("graphical_create", onCreate);
  mapboxDraw.on("graphical_update", onUpdate);
  mapboxDraw.on("graphical_click", onGraphicalClick);
}

function onCreate(e) {
  MapStore.setDrawData(e.features);
  emit("draw-data", e.features);
}

function onUpdate(e) {
  MapStore.setDrawData(e.features);
  emit("draw-data", e.features);
}

function onGraphicalClick() {
  emit("draw-click");
}

function closeMap() {
  mapboxDraw.off("graphical_create", onCreate);
  mapboxDraw.off("graphical_update", onUpdate);
  mapboxDraw.off("graphical_click", onGraphicalClick);
  mapboxDraw.clearGraphicalData();
  mapboxDraw.destroy();
  mapboxLayer.destroy();
  // mapbox.getMap().removeControl(control);
  mapbox.destroy();
  control = null;
  console.warn("关闭地图");
}

function getMapboxDrow() {
  return mapboxDraw;
}

onBeforeMount(() => {});

defineExpose({
  customPoint,
  lineString,
  polygon,
  circle,
  initMap,
  closeMap,
  getMapboxDrow,
});
</script>

<template>
  <div class="map">
    <div id="map" ref="map"></div>
    <MapSwitch v-if="loading" :mapSwitchInstance="mapSwitchInstance" />
  </div>
</template>

<style scoped lang="scss">
.map {
  width: 100%;
  height: 100%;
  border: 1px solid #1e90ff;
  position: relative;
  #map {
    width: 100%;
    height: 100%;
  }
}
</style>
