<script>
export default {
  name: "IconBox",
};
</script>

<script setup>
import { computed } from "vue";
import SvgIcon from "package/SvgIcon/src/index.vue";
defineOptions({
  name: "IconBox",
});

const model = defineModel();

const icons = computed(() => {
  const filePaths = Object.keys(import.meta.glob("@/icons/*.svg"));
  return filePaths.map((path) => {
    const val = path.split("/").pop().replace(".svg", "");
    return {
      label: val,
      value: val,
    };
  });
});

function onChange(val) {
  model.value = val;
}
</script>

<template>
  <el-select-v2
    popper-class="icon-select__popper"
    :model-value="model"
    :options="icons"
    filterable
    autocomplete
    placeholder="请选择图标"
    item-height="40"
    @change="onChange">
    <template #prefix>
      <svg-icon style="width: 20px; height: 20px" :name="model" />
    </template>
    <template #default="{ item }">
      <svg-icon class="option-icon" :name="item.value" />
      <span>
        {{ item.label }}
      </span>
    </template>
  </el-select-v2>
</template>

<style lang="scss">
.icon-select__popper {
  .el-select-dropdown__item {
    display: flex;
    align-items: center;
    .option-icon {
      width: 25px;
      height: 25px;
      margin-right: 7px;
    }
  }
}
</style>
