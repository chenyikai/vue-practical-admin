<script>
export default {
  name: "NormalTd",
};
</script>

<script setup>
import useTd from "package/Crud/src/useTd.js";

defineOptions({
  name: "NormalTd",
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

const { value, onTdChange, editabled } = useTd(props);
</script>

<template>
  <div v-if="!editabled" class="normal-td-box">{{ value }}</div>

  <div v-else class="normal-td-box">
    <el-input v-model="value" @change="onTdChange" />
  </div>
</template>

<style scoped lang="scss"></style>
