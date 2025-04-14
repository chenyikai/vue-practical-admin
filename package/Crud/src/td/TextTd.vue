<script>
export default {
  name: "TextTd",
};
</script>

<script setup>
import useTd from "package/Crud/src/useTd.js";

defineOptions({
  name: "TextTd",
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

const { config, value, currentTd } = useTd(props);
</script>

<template>
  <div ref="currentTd" class="tet-td-box" @click.stop>
    <el-tooltip
      :content="value"
      v-bind="config.tooltip"
      v-if="config.truncated">
      <el-text v-bind="config">{{ value }}</el-text>
    </el-tooltip>

    <el-text v-else v-bind="config">{{ value }}</el-text>
  </div>
</template>
