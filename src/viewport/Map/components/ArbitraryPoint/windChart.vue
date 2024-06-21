<script setup>
import * as echarts from "echarts";
import { ref, defineProps, onMounted, reactive } from "vue";

defineProps({
  clickType: { type: Number },
});

const chart = ref(); // ​定义一个响应式的值，用于传递图表
const xAxisData = reactive([]);
const seriesData = reactive([]);
const option = reactive({
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
});

const init = () => {
  const myChart = echarts.init(chart.value);
  myChart.setOption(option);
};
onMounted(() => {
  init();
});

defineExpose({
  init,
  xAxisData,
  seriesData,
});
</script>

<script>
export default {
  name: "windChart",
};
</script>

<template>
  <div ref="chart" id="wind" style="width: 750px; height: 400px"></div>
</template>

<style scoped lang="scss">
#wind {
  margin-top: 20px;
  background-color: rgb(235, 238, 231);
}
</style>
