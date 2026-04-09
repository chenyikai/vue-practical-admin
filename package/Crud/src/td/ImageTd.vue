<script>
export default {
  name: "ImageTd",
};
</script>

<script setup>
import useTd from "package/Crud/src/useTd.js";

defineOptions({
  name: "ImageTd",
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

const { value, editabled } = useTd(props);
</script>

<template>
  <div class="image-td-box" @click.stop v-if="!editabled">
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
  <div class="image-td-box" v-else />
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
