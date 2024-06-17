<script setup>
import { watch } from "vue";
import { mapStore } from "@/store/index.js";
import { ref } from "vue";
defineOptions({
  name: "ArbitraryPoint",
});

const MapStore = mapStore();
const dialogVisible = ref(false);
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
        <div class="line"></div>
        <div class="title">未来24小时天气</div>
        <div class="btnList">
          <div class="btn_item">风</div>
          <div class="btn_item">温度</div>
          <div class="btn_item">降水</div>
        </div>
        <div class="echart">echart</div>
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
    margin-bottom: 10px;
  }
  .weather {
    display: inline-block;
    background-color: #497da5;
    padding: 5px 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    pointer-events: none;
  }
  .weather_detail {
    display: flex;
    margin-bottom: 10px;
    .weather_detail_item {
      margin-right: 10px;
    }
  }
}
.my-header {
  padding: 10px 0 10px 20px;
  background-color: #546279;
}
</style>
