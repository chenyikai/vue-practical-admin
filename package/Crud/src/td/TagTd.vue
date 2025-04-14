<script>
export default {
  name: "TagTd",
};
</script>

<script setup>
import useTd from "package/Crud/src/useTd.js";
import { computed } from "vue";

defineOptions({
  name: "TagTd",
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

const type = computed(() => config.value.type || "primary");
</script>

<template>
  <div class="tag-td-box" @click.stop>
    <el-tag v-bind="config" :type="type">{{ value }}</el-tag>
  </div>
</template>
