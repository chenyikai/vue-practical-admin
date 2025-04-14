<script>
export default {
  name: "ImageTd",
};
</script>

<script setup>
import { computed } from "vue";

defineOptions({
  name: "ImageTd",
});

const { column, scope } = defineProps({
  column: {
    type: Object,
    default: () => {},
  },
  scope: {
    type: Object,
    default: () => {},
  },
});

const config = computed(() => {
  if (typeof column?.config === "function") {
    return column?.config(scope.row) || {};
  } else {
    return column?.config || {};
  }
});

const value = computed(() => scope.row[column.prop]);
</script>

<template>
  <div class="image-td-box" @click.stop>
    <el-image
      style="width: 50px; height: 50px"
      class="image"
      :src="value"
      fit="cover"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :z-index="10000"
      :preview-src-list="[value]"
      hide-on-click-modal
      show-progress
      v-bind="config"
      preview-teleported />
  </div>
</template>

<style lang="scss" scoped>
.image-td-box {
  display: flex;
  justify-content: center;
  align-items: center;
  .image {
    border-radius: 6px;
  }
}
</style>
