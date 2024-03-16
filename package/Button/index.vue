<script>
export default {
  name: "PageButton",
};
</script>

<script setup>
import { readonly, computed } from "vue";
const buttonMap = readonly({
  search: {
    icon: new URL("./images/search.svg", import.meta.url),
    label: "搜索",
  },
  reset: {
    icon: new URL("./images/reset.svg", import.meta.url),
    label: "重置",
  },
  add: {},
  delete: {},
  update: {},
  detail: {},
  export: {},
  download: {},
});
const props = defineProps({
  type: {
    type: String,
    default: null,
    validator(value) {
      return [
        "search",
        "reset",
        "add",
        "delete",
        "update",
        "detail",
        "export",
        "download",
      ].includes(value);
    },
  },
});
const buttonAtr = computed(() => buttonMap[props["type"]]);
</script>

<template>
  <el-button class="page-button" :class="props['type']">
    <img class="icon" :src="buttonAtr['icon']" alt="" />
    <span class="label">{{ buttonAtr["label"] }}</span>
  </el-button>
</template>

<style scoped lang="scss">
.page-button {
  padding: 8px 10px;
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  &.search {
    display: flex;
    align-items: center;
    background-color: #409eff;
    color: #fff;
    &:hover {
      background-color: rgba($color: #409eff, $alpha: 0.7);
    }
  }
  &.reset {
    display: flex;
    align-items: center;
    background-color: #86898a;
    color: #fff;
    &:hover {
      background-color: rgba($color: #86898a, $alpha: 0.7);
    }
  }
}
</style>
