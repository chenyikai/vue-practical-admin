<script>
export default {
  name: "TableColumn",
};
</script>

<script setup>
import { inject, computed, onMounted } from "vue";
import ImageTd from "./td/ImageTd.vue";
import TagTd from "package/Crud/src/td/TagTd.vue";
import NormalTd from "package/Crud/src/td/NormalTd.vue";
import RateTd from "package/Crud/src/td/RateTd.vue";
import TextTd from "package/Crud/src/td/TextTd.vue";
import { validatenull } from "@/utils/validate.js";

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

const tdMap = {
  normal: NormalTd,
  image: ImageTd,
  tag: TagTd,
  rate: RateTd,
  text: TextTd,
};

const slots = inject("slots");
const getHeadSlot = inject("getHeadSlot");
const getFilterIcon = inject("getFilterIcon");

// const config = inject("config");

const hasChild = computed(
  () =>
    Array.isArray(props.column.children) && props.column.children.length !== 0,
);

const tdType = computed(() => {
  if (validatenull(props.column?.type)) {
    return "normal";
  } else {
    return props.column?.type;
  }
});

function getComponent() {
  const c = tdMap[tdType.value];

  return c ? c : NormalTd;
}

function onChange(val) {
  console.log(val, "onChange");
}

onMounted(() => {
  // console.log(slots);
});
</script>

<template>
  <el-table-column
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    align="center"
    v-bind="column">
    <template v-slot:default="scope">
      <slot :name="column.prop" :scope="scope">
        <component
          :is="getComponent(column)"
          :column="column"
          :scope="scope"
          @change="onChange" />
      </slot>
    </template>
  </el-table-column>
</template>

<style scoped lang="scss"></style>
