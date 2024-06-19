<script setup>
import { watch } from "vue";
import { mapStore } from "@/store/index.js";
import { ref, onMounted, reactive } from "vue";
import { Mapbox, MapboxDraw } from "plugins";
import { dateFormat } from "@/utils/date.js";
import { get_random_point_weather } from "./api.js";
// import * as echarts from "echarts";
defineOptions({
  name: "ArbitraryPoint",
});

const MapStore = mapStore();
const dialogVisible = ref(false);
let clickType = ref(1);
let title = ref("气象水文");
function open(val) {
  if (val === 4) {
    Mapbox.map.on("click", getDataByLonLat);
  } else {
    isOpenDialog(false);
    Mapbox.map.off("click", getDataByLonLat);
  }
}
function getDataByLonLat(e) {
  let day = dateFormat(new Date(), "yyyy-MM-dd");
  const obj = { day, lat: e.lngLat.lat, lon: e.lngLat.lng };
  get_random_point_weather(obj).then(({ data }) => {
    isOpenDialog(true, data.data);
  });
}
function isOpenDialog(val, data) {
  dialogVisible.value = val;
  if (data) {
    const arr = data.v.map((item) => {
      const obj = {};
      item.forEach((element, index) => {
        obj[data.k[index]] = element;
      });
      return obj;
    });
    arr = arr.map((item) => {
      console.log(dateFormat(new Date(item.forecastTime), "yyyy-MM-dd"));
      return {
        ...item,
        forecastTime: dateFormat(new Date(item.forecastTime), "yyyy-MM-dd"),
      };
    });
    console.log(arr);
  }
}
function handleClick(val) {
  clickType.value = val;
  console.log("换成", val, "的echart");
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
    <el-dialog v-model="dialogVisible" width="800" draggable>
      <template #header="{ close, titleId, titleClass }">
        <div class="my-header">
          <h3 :id="titleId" :class="titleClass">{{ title }}</h3>
        </div>
      </template>
      <div class="main">
        <div class="title">天气实况</div>
        <div class="weather">
          <div class="weather_icon"></div>
          <div class="weather_text">阴</div>
        </div>
        <div class="weather">
          <div class="weather_icon"></div>
          <div class="weather_text">东北风四级</div>
        </div>
        <div class="weather_detail">
          <div class="weather_detail_item">温度:18.56℃</div>
          <div class="weather_detail_item">云量:100.0%</div>
          <div class="weather_detail_item">湿度:70.0%</div>
        </div>
        <el-divider />
        <div class="title">未来24小时天气</div>
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
        <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
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
.wind {
  width: 200px;
  height: 200px;
}
</style>
