<script>
export default {
  name: "RateTd",
};
</script>

<script setup>
import useTd from "package/Crud/src/useTd.js";

defineOptions({
  name: "RateTd",
});

const props = defineProps({
  column: {
    type: Object,
    default: () => {},
  },
  scope: {
    type: Object,
    default: () => {},
  },
});

const { config, value } = useTd(props);
</script>

<template>
  <div class="rate-td-box" @click.stop>
    <el-rate :model-value="value" v-bind="config" />
  </div>
</template>
