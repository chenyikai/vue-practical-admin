<script setup>
import { useAttrs } from "vue";

const attrs = useAttrs();

defineOptions({
  name: "SkeletonBox",
});

const { option } = defineProps({
  option: {
    type: Object,
    default: () => {
      return {
        column: [],
      };
    },
  },
});

function _getItemType(_item) {}
</script>

<template>
  <el-skeleton
    animated
    :throttle="{ leading: 500, initVal: true }"
    class="skeleton-box-container"
    v-bind="attrs">
    <template #template v-if="Array.isArray(option.column)">
      <el-form class="skeleton-form" :label-width="option.labelWidth || 'auto'">
        <el-row>
          <el-col v-for="item in option.column" :key="item.prop" :span="item?.span || 12">
            <el-form-item :label="item.label" :required="!!item.rules">
              <el-skeleton-item variant="rect" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #default>
      <slot />
    </template>
  </el-skeleton>
</template>

<style scoped lang="scss">
.skeleton-box-container {
  width: 100%;
  .el-skeleton__item {
    height: 30px !important;
  }
}
</style>
