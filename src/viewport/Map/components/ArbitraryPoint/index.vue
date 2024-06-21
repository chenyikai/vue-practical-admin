<script setup>
import { watch } from "vue";
import { mapStore } from "@/store/index.js";
import { ref, onMounted, reactive } from "vue";
import { Mapbox, MapboxDraw } from "plugins";
import { dateFormat } from "@/utils/date.js";
import { get_random_point_weather } from "./api.js";
import WindChart from "./windChart.vue";
import TemperatureChart from "./temperatureChart.vue";
import PrecipitationChart from "./precipitationChart.vue";
defineOptions({
  name: "ArbitraryPoint",
});

const MapStore = mapStore();
const dialogVisible = ref(false);
let clickType = ref(1);
let title = ref("气象水文");
let weatherList = reactive([]);
let nowWeather = reactive({});
let loading = ref(true);
const windChart = ref({});
const temperatureChart = ref({});
const precipitationChart = ref({});
function open(val) {
  if (val === 4) {
    Mapbox.map.on("click", getDataByLonLat);
    Mapbox.map.on("mousemove", handleMouseMove);
  } else {
    isOpenDialog(false);
    Mapbox.map.off("click", getDataByLonLat);
    Mapbox.map.off("mousemove", handleMouseMove);
    let canvas = Mapbox.map.getCanvasContainer();
    canvas.style.cursor = "";
  }
}
function handleMouseMove() {
  let canvas = Mapbox.map.getCanvasContainer();
  canvas.style.cursor = "crosshair";
}
let lonlatObj = ref({});
function getDataByLonLat(e) {
  let day = dateFormat(new Date(), "yyyy-MM-dd");
  lonlatObj = { day, lat: e.lngLat.lat, lon: e.lngLat.lng };
  get_random_point_weather(lonlatObj).then(({ data }) => {
    isOpenDialog(true, data.data);
  });
}
let dateList = reactive([]);
let windZLevel = reactive([]);
let precipitation = reactive([]);
let temperature = reactive([]);
function isOpenDialog(val, data) {
  if (data) {
    let arr = data.v.map((item) => {
      const obj = {};
      item.forEach((element, index) => {
        obj[data.k[index]] = element;
      });
      return obj;
    });
    weatherList = arr.map((item) => {
      return {
        ...item,
        forecastTime: dateFormat(
          new Date(Number(item.forecastTime)),
          "yyyy-MM-dd",
        ),
      };
    });

    dateList = weatherList.map((item) => item.forecastTime);
    windZLevel = weatherList.map((item) => item.windZLevel);
    precipitation = weatherList.map((item) => item.precipitation);
    temperature = weatherList.map((item) => item.temperature);
    nowWeather = weatherList[0];
    windChart.value.xAxisData = dateList;
    windChart.value.seriesData = windZLevel;
    dialogVisible.value = val;
  }
}
function handleClick(val) {
  if (clickType.value === val) return;
  clickType.value = val;
}
watch(
  () => MapStore.$state.qxType,
  (news) => {
    open(news);
  },
);
</script>

<template>
  <div class="ArbitraryPointDialog">
    <el-dialog
      v-model="dialogVisible"
      width="800"
      draggable
      v-loading="loading">
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h3 :id="titleId" :class="titleClass">
            {{ title }}-- 纬度:{{ lonlatObj.lat.toFixed(2) }} 经度:{{
              lonlatObj.lon.toFixed(2)
            }}
          </h3>
        </div>
      </template>
      <div class="main">
        <div class="title">天气实况</div>
        <div class="weather">
          <div class="weather_icon"></div>
          <div class="weather_text">{{ nowWeather.skycon }}</div>
        </div>
        <div class="weather">
          <div class="weather_icon"></div>
          <div class="weather_text">
            {{ nowWeather.windDirection }}风{{ nowWeather.windLevel }}级
          </div>
        </div>
        <div class="weather_detail">
          <div class="weather_detail_item">
            温度:{{ nowWeather.temperature }}℃
          </div>
          <div class="weather_detail_item">
            湿度:{{ (nowWeather.humidity * 100).toFixed(1) }}%
          </div>
          <div class="weather_detail_item">
            能见度:{{ nowWeather.visibility }}%
          </div>
        </div>
        <el-divider />
        <div class="title">未来天气</div>
        <div class="btn_list">
          <div
            class="btn_item"
            :class="clickType === 1 ? 'active' : ''"
            @click="handleClick(1)">
            风
          </div>
          <div
            class="btn_item"
            :class="clickType === 2 ? 'active' : ''"
            @click="handleClick(2)">
            温度
          </div>
          <div
            class="btn_item"
            :class="clickType === 3 ? 'active' : ''"
            @click="handleClick(3)">
            降水
          </div>
        </div>
        <WindChart v-if="clickType === 1" ref="windChart" />
        <TemperatureChart v-if="clickType === 2" ref="temperatureChart" />
        <PrecipitationChart v-if="clickType === 3" ref="precipitationChart" />
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.ArbitraryPointDialog {
  pointer-events: auto;
}
.main {
  padding: 20px;
  pointer-events: none;
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  .weather {
    display: inline-block;
    background-color: #497da5;
    padding: 5px 10px;
    margin-bottom: 20px;
    margin-right: 10px;
    pointer-events: none;
  }
  .weather_detail {
    display: flex;
    margin-bottom: 20px;
    .weather_detail_item {
      margin-right: 10px;
    }
  }
  .btn_list {
    display: flex;
    .btn_item {
      width: 60px;
      padding: 3px;
      border-radius: 1px;
      text-align: center;
      cursor: pointer;
      pointer-events: auto;
    }
    .active {
      background-color: #7198f8;
    }
  }
}
.my-header {
  padding: 10px 0 10px 20px;
  background-color: #546279;
}
</style>
