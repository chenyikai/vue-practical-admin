<script setup>
import { MapboxDraw } from "plugins";
import { ref, watch } from "vue";
import { parse } from "wellknown";
import Dialog from "./dialog.vue";
import { getPtShipFenceList } from "@/api/map/ptfence.js";
import { mapStore } from "@/store/index.js";

defineOptions({
  name: "ChannelMonitor",
});

const MapStore = mapStore();
const dialogBox = ref();
let dataList = ref([]);

function init() {
  getPtShipFenceList().then(({ data }) => {
    dataList.value = data.data;
    let feature = dataList.value.map((item) => {
      return {
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
          "graphical-type": "ChannelMonitor",
          uid: item.id,
          name: item.name,
        },
        geometry: parse(item.geopath),
      };
    });
    MapboxDraw.setGraphicalData(feature);
    MapboxDraw.render();

    MapboxDraw.on("graphical_click", ({ feature }) => {
      dialogBox.value.open(feature.properties.uid);
    });
  });
}

watch(
  () => MapStore.initMap,
  (news) => {
    if (news) init();
  },
  { deep: true },
);

defineExpose({
  init,
});
</script>

<template>
  <div></div>
  <Dialog ref="dialogBox" />
</template>

<style scoped lang="scss"></style>
