<template>
  <transition name="fade">
    <div
      class="legend-pack"
      v-show="isShow"
      element-loading-custom-class="legend-pack-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      v-loading.fullscreen.lock="loading">
      <svg-icon
        class="icon-box"
        :name="'mapMeteorology-left'"
        @click="packButton('down')" />
      <div class="text-box">
        {{ dataList[key] ? `${dataList[key][0]} 大风分布` : "暂无数据" }}
      </div>
      <svg-icon
        class="icon-box"
        :name="'mapMeteorology-right'"
        @click="packButton('up')" />
    </div>
  </transition>

  <transition name="fade">
    <div class="gales-legend" v-show="isShow">
      <div class="title-top">图例 大风分布</div>
      <div class="list-box">
        <div class="color-box" v-for="(item, i) in palette" :key="item.level">
          <div class="color" :style="`background-color:${item.color}`">
            <span>{{
              `${palette.length === i + 1 ? "≥" + item.level : item.level}级`
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { mapConfig } from "@/plugins/mapConfig.js";
import { getBigWindForecastList, getEhhTxt } from "@/api/map/meteorology.js";
import { parse } from "wellknown";
import { dateFormat } from "@/utils/date.js";
import { ref, watch } from "vue";
import { Mapbox } from "plugins";
import SvgIcon from "package/SvgIcon/src/index.vue";
import { mapStore } from "@/store/index.js";

defineOptions({
  name: "GalesPack",
});

const MapStore = mapStore();
let loading = ref(false);
let isShow = ref(false);
let dataList = ref([]);
let key = ref(0);
let windareaList = ref([]);
const palette = [
  { color: "#f5ffd4", level: 7 },
  { color: "#fff3d4", level: 8 },
  { color: "#fffb9b", level: 9 },
  { color: "#ffdec4", level: 10 },
  { color: "#ffcc95", level: 11 },
  { color: "#ff904b", level: 12 },
  { color: "#c12c1f", level: 13 },
];

function open(type) {
  type === 1 ? handleGales(true) : handleGales(false);
  isShow.value = type === 1;
}

function handleGales(event) {
  if (event) {
    key.value = 0;
    loading.value = true;
    getBigWindForecastList().then(({ data }) => {
      if (data.code === 200) {
        dataList.value = data.data.v.map((item) => {
          return [dateFormat(Number(item[0]), "yyyy年MM月dd日hh时"), item[1]];
        });
        renderGales();
      }
    });
  } else {
    closeGales();
  }
}
function packButton(type) {
  const length = dataList.value.length;
  switch (type) {
    case "up":
      if (key.value < length) {
        key.value += 1;
        renderGales();
      }
      break;
    case "down":
      if (key.value > 0) {
        key.value -= 1;
        renderGales();
      }
      break;
  }
}

function renderGales() {
  if (dataList.value[key.value][1]) {
    getEhhTxt({ url: dataList.value[key.value][1] }).then(({ data }) => {
      const e = JSON.parse(data.data);
      e.windarea.v.map((item) => {
        const list = {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {
                  id: `windarea-${item[0]}`,
                  type: "windarea",
                  value: Number(item[0]),
                },
                geometry: parse(item[1]),
              },
            ],
          },
        };
        windareaList.value.push(`windarea-${item[0]}`);
        InitPoints(list);
        flyTo();
        loading.value = false;
      });
    });
  } else {
    loading.value = false;
  }
}
function closeGales() {
  let delList = [];
  windareaList.value.map((item) => {
    if (Mapbox.getMap().getLayer(item)) {
      Mapbox.getMap().removeLayer(item);
      Mapbox.getMap().removeSource(item);
    }
    delList.push(item);
  });
  windareaList.value = windareaList.value.filter(
    (item) => !delList.includes(item),
  );
}

function InitPoints(row) {
  // 初始化层&面数据
  const properties = row.data.features[0].properties;
  let color = "";
  palette.map((item) => {
    if (item.level === properties.value) {
      color = item.color;
    } else if (properties.value > 13) {
      color = palette[palette.length - 1].color;
    }
  });
  if (Mapbox.getMap().getLayer(properties.id)) {
    Mapbox.getMap().removeLayer(properties.id);
    Mapbox.getMap().removeSource(properties.id);
  }
  Mapbox.getMap().addSource(properties.id, row);
  Mapbox.getMap().addLayer({
    id: properties.id,
    type: "fill",
    source: properties.id,
    paint: {
      "fill-color": color,
      "fill-opacity": 0.85,
    },
  });
}
function flyTo() {
  Mapbox.getMap().flyTo({
    center: mapConfig.center,
    zoom: 2.5,
    speed: 5,
    curve: 0.5,
  });
}

watch(
  () => MapStore.$state.qxType,
  (news) => {
    open(news);
  },
);

defineExpose({
  open,
});
</script>

<style lang="scss" scoped>
.legend-pack {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-bottom: 10px;
  pointer-events: all;
  width: 380px;
  background: rgba(0, 47, 68, 0.68);
  border: 2px solid;
  border-image: linear-gradient(
      360deg,
      rgba(32, 114, 238, 1),
      rgba(1, 246, 255, 1)
    )
    1 1;
  box-shadow: inset 0 0 33px 0 #2394e6;
  color: white;
  padding: 10px 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  .icon-box {
    width: 19px;
    height: 19px;
    font-size: 19px;
    cursor: pointer;
  }
}
.gales-legend {
  position: absolute;
  bottom: 7%;
  left: 0.7%;
  font-size: 14px;
  padding: 5px 8px;
  background: rgba(0, 47, 68, 0.68);
  border: 2px solid;
  border-image: linear-gradient(
      360deg,
      rgba(32, 114, 238, 1),
      rgba(1, 246, 255, 1)
    )
    1 1;
  box-shadow: inset 0 0 33px 0 #2394e6;
  .title-top {
    margin-bottom: 12px;
  }
  .list-box {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 5px 5px;
    .color-box {
      .color {
        width: 100%;
        color: black;
        padding: 5px 10px;
        box-sizing: border-box;
        text-shadow:
          1px 1px 0 white,
          -1px -1px 0 white,
          1px -1px 0 white,
          -1px 1px 0 white;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    transform 0.25s ease-in-out,
    opacity 0.25s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-30%);
}
</style>

<style lang="scss">
.legend-pack-loading {
  .el-loading-spinner .path {
    stroke: white;
  }
}
</style>
