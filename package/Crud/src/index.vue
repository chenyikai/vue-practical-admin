<script>
export default {
  name: "PageCrud",
};
</script>

<script setup>
import { computed, useSlots, provide } from "vue";
import { validatenull } from "@/utils/validate.js";
import loadingIcon from "@/icons/loading.svg?raw";
import TableColumn from "package/Crud/src/TableColumn.vue";
import DefaultSlot from "./slots/DefaultSlot.vue";
import HeaderSlot from "package/Crud/src/slots/HeaderSlot.vue";

defineOptions({
  name: "PageCrud",
});

const slots = useSlots();

const props = defineProps({
  data: {
    type: Array,
    default: () => {
      return [];
    },
  },
  config: {
    type: Object,
    required: true,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const tableType = computed(() => {
  return props.config.type;
});

provide("slots", slots);
provide("config", props.config);
provide("getHeadSlot", getHeadSlot);
provide("getFilterIcon", getFilterIcon);

function getHeadSlot(prop) {
  return `${prop}Header`;
}

function getFilterIcon(prop) {
  return `${prop}FilterIcon`;
}
</script>

<template>
  <section class="crud-container">
    <el-table
      v-loading="loading"
      :element-loading-spinner="loadingIcon"
      element-loading-text="加载中"
      element-loading-svg-view-box="0 0 57 57"
      border
      v-bind="config"
      :data="data"
      style="width: 100%">
      <!-- default插槽 -->
      <template #default v-if="!validatenull(slots.default)">
        <slot name="default"></slot>
      </template>

      <!-- append插槽 -->
      <template #append v-if="!validatenull(slots.append)">
        <slot name="append"></slot>
      </template>

      <!-- empty插槽 -->
      <template #empty v-if="!validatenull(slots.empty)">
        <slot name="empty"></slot>
      </template>

      <!-- 索引 选择 展开column -->
      <template v-if="!validatenull(tableType)">
        <el-table-column :type="tableType" />
      </template>

      <!-- 数据column -->
      <template v-for="column in config.columns" :key="column.prop">
        <table-column :column="column">
          <!-- default插槽 -->
          <template v-slot:[column.prop]>
            <default-slot :name="column.prop" :slots="slots" />
          </template>

          <!-- header插槽 -->
          <template v-slot:[getHeadSlot(column.prop)]>
            <header-slot :name="column.prop" :slots="slots" />
          </template>

          <!-- filter-icon插槽 -->
          <template
            v-if="slots[getFilterIcon(column.prop)]"
            v-slot:[getFilterIcon(column.prop)]>
            <slot :name="getFilterIcon(column.prop)"></slot>
          </template>

          <!-- 子节点插槽 -->
          <template
            v-for="childColumn in column.children"
            v-slot:[childColumn.prop]>
            <!-- default插槽 -->
            <template v-if="slots[childColumn.prop]">
              <slot :name="childColumn.prop"></slot>
            </template>
          </template>
        </table-column>
      </template>
    </el-table>
  </section>
</template>

<style scoped lang="scss">
.crud-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
