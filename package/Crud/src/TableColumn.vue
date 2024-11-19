<script>
export default {
  name: "TableColumn",
};
</script>

<script setup>
// import { validatenull } from "@/utils/validate.js";
import { inject, computed, onMounted } from "vue";

defineOptions({
  name: "TableColumn",
});

const props = defineProps({
  column: {
    type: Object,
    default: () => {},
  },
  isChild: {
    type: Boolean,
    default: false,
  },
});

const slots = inject("slots");
const getHeadSlot = inject("getHeadSlot");
const getFilterIcon = inject("getFilterIcon");

// const config = inject("config");

const hasChild = computed(
  () =>
    Array.isArray(props.column.children) && props.column.children.length !== 0,
);

onMounted(() => {
  // console.log(slots);
});
</script>

<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    v-bind="column">
    <template v-if="hasChild">
      <table-column
        v-for="childColumn in column.children"
        :key="childColumn.prop"
        :column="childColumn"
        isChild>
        <template v-if="slots[childColumn.prop]" v-slot:[childColumn.prop]>
          <slot :name="childColumn.prop"></slot>
        </template>
      </table-column>
    </template>

    <!-- default插槽 -->
    <template v-if="!hasChild && slots[column.prop]" #default>
      <slot :name="column.prop"></slot>
    </template>

    <!-- header插槽 -->
    <template v-if="!hasChild && slots[getHeadSlot(column.prop)]" #header>
      <slot :name="getHeadSlot(column.prop)"></slot>
    </template>

    <!-- filter-icon插槽 -->
    <template
      v-if="!hasChild && slots[getFilterIcon(column.prop)]"
      #filter-icon>
      <slot :name="getFilterIcon(column.prop)"></slot>
    </template>
  </el-table-column>
</template>

<style scoped lang="scss"></style>
