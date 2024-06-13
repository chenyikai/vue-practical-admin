<script setup>
import { MapboxDraw } from "plugins";
import { ref } from "vue";
import { parse } from "wellknown";
import Dialog from "./dialog.vue";
import { getPtShipFenceList } from "@/api/map/ptfence.js";

defineOptions({
  name: "ChannelMonitor",
});

const dialogBox = ref();
let dataList = ref([
  {
    id: 1,
    name: "测试电子围栏",
    wkt: "POLYGON ((121.78035736083984 31.383390819824612, 121.78550720214844 31.38368391461833, 121.79563522338867 31.365510308093945, 121.79838180541991 31.352024393359414, 121.79838180541991 31.323580364576856, 121.80473327636717 31.307008488870764, 121.798038482666 31.294834368867328, 121.78842544555664 31.29835475797826, 121.79357528686523 31.307595153721934, 121.7937469482422 31.322113944518094, 121.7937469482422 31.340295938751325, 121.79254531860352 31.35832783341131, 121.79031372070314 31.366243182817385, 121.78035736083984 31.383390819824612))",
  },
]);

function init() {
  getPtShipFenceList().then(({ data }) => {
    dataList.value = data.data;
    dataList.value.map((item) => {
      const feature = {
        type: "Feature",
        id: `ChannelMonitor-${item.id}`,
        properties: {
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
          "graphical-type": "polygon",
          name: item.name,
        },
        geometry: parse(item.geopath),
      };
      MapboxDraw.draw.add(feature);
    });
  });
}

defineExpose({
  init,
});
</script>

<template>
  <div></div>
  <Dialog ref="dialogBox" />
</template>

<style scoped lang="scss"></style>
