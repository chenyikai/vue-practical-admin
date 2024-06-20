<script setup>
import * as echarts from "echarts";

import { ref, defineProps, onMounted, reactive } from "vue";

defineProps({
  clickType: { type: Number },
});

const precipitationChart = ref(); // ​定义一个响应式的值，用于传递图表
const xAxisData = reactive(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
const seriesData = reactive([150, 230, 224, 218, 135, 147, 260]);
const init = () => {
  const myChart = echarts.init(precipitationChart.value);
  let option = {
    xAxis: {
      data: xAxisData,
    },
    yAxis: { type: "value" },
    series: [
      {
        data: seriesData,
        type: "line",
      },
    ],
  };
  myChart.setOption(option);
};
onMounted(() => init());

defineExpose({
  init,
  xAxisData,
  seriesData,
});
</script>

<script>
export default {
  name: "precipitationChart",
};
</script>

<template>
  <div
    v-if="clickType === 3"
    ref="precipitationChart"
    id="precipitationChart"
    style="width: 750px; height: 400px"></div>
</template>

<style scoped lang="scss">
#precipitationChart {
  margin-top: 20px;
  background-color: rgb(235, 238, 231);
}
</style>
