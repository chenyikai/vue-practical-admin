<script setup>
import * as echarts from "echarts";

import { ref, defineProps, onMounted } from "vue";

defineProps({
  clickType: { type: Number },
});

const temperatureChart = ref(); // ​定义一个响应式的值，用于传递图表

const init = () => {
  const myChart = echarts.init(temperatureChart.value);
  let option = {
    xAxis: {
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: { type: "value" },
    series: [
      {
        data: [150, 230, 224, 218, 135, 147, 260],
        type: "line",
      },
    ],
  };
  myChart.setOption(option);
};
onMounted(() => {
  init();
});

defineExpose({
  init,
});
</script>

<script>
export default {
  name: "temperatureChart",
};
</script>

<template>
  <div
    v-if="clickType === 2"
    ref="temperatureChart"
    id="temperatureChart"
    style="width: 750px; height: 400px"></div>
</template>

<style scoped lang="scss">
#temperatureChart {
  margin-top: 20px;
  background-color: rgb(235, 238, 231);
}
</style>
