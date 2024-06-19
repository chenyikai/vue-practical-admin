<script setup>
import * as echarts from "echarts";

import { onMounted, ref } from "vue";

const chart = ref(); // ​定义一个响应式的值，用于传递图表

const init = () => {
  const myChart = echarts.init(chart.value);
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
</script>

<script>
export default {
  name: "windChart",
};
</script>

<template>
  <div ref="chart" id="wind"></div>
</template>

<style scoped lang="scss">
#wind {
  margin-top: 20px;
  width: 100%;
  height: 300px;
  // background-color: greenyellow;
}
</style>
