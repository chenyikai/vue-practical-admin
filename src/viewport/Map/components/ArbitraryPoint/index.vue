<script setup>
import { watch } from "vue";
import { mapStore } from "@/store/index.js";
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
defineOptions({
  name: "ArbitraryPoint",
});

// let wind = ref("");
// console.log(echarts, "echarts");
// const myChart = echarts.init(document.getElementById("wind"));
// console.log(myChart, "myChart");
// const option = ref({
//   xAxis: {
//     type: "category",
//     data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//   },
//   yAxis: {
//     type: "value",
//   },
//   series: [
//     {
//       data: [150, 230, 224, 218, 135, 147, 260],
//       type: "line",
//     },
//   ],
// });
// onMounted(() => {
//   option.value && myChart.setOption(option);
// });

const MapStore = mapStore();
const dialogVisible = ref(false);
let clickType = ref(1);
let title = ref("气象水文");
function open(val) {
  val === 4 ? isOpenDialog(true) : isOpenDialog(false);
}
function isOpenDialog(val) {
  dialogVisible.value = val;
  if (val) {
    console.log("打开弹窗");
  } else {
    console.log("关闭弹窗");
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
        <div id="wind" ref="wind">echart</div>
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
