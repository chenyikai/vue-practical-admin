<script>
export default {
  name: "PageButton",
};
</script>

<script setup>
// import { useCssVar } from "@vueuse/core";
import { readonly, computed, toRefs, reactive } from "vue";
import { validatenull } from "@/utils/validate.js";
const emits = defineEmits({
  click: null,
});
// const themeColor = useCssVar("--theme-color");
const buttonMap = readonly({
  search: {
    icon: new URL("../images/search.svg", import.meta.url),
    label: "搜索",
    bgColor: "#409eff",
  },
  reset: {
    icon: new URL("../images/reset.svg", import.meta.url),
    label: "重置",
  },
  create: {
    icon: new URL("../images/create.svg", import.meta.url),
    label: "新增",
    // bgColor: themeColor.value,
    fontColor: "#fff",
  },
  delete: {
    icon: new URL("../images/delete.svg", import.meta.url),
    label: "删除",
  },
  update: {
    icon: new URL("../images/update.svg", import.meta.url),
    label: "更新",
  },
  detail: {
    icon: new URL("../images/detail.svg", import.meta.url),
    label: "详情",
  },
  export: {
    icon: new URL("../images/export.svg", import.meta.url),
    label: "导出",
  },
  download: {
    icon: new URL("../images/download.svg", import.meta.url),
    label: "下载",
  },
  pic: {
    icon: new URL("../images/pic.svg", import.meta.url),
    label: "查看图片",
  },
});
const props = defineProps({
  type: {
    type: String,
    default: null,
    validator(value) {
      return [
        "search",
        "reset",
        "create",
        "delete",
        "update",
        "detail",
        "export",
        "download",
        "pic",
      ].includes(value);
    },
  },
  icon: {
    type: Object,
    default: null,
  },
  label: {
    type: String,
    default: null,
  },
  direction: {
    type: String,
    default: "vertical",
    validator(value) {
      return ["horizontal", "vertical"].includes(value);
    },
  },
});
const buttonAtr = computed(() => {
  const val = buttonMap[props["type"]];
  return validatenull(val) ? reactive({}) : val;
});
const { bgColor } = toRefs(buttonAtr.value);

function handleClick(e) {
  emits("click", e);
}
</script>

<template>
  <el-button
    class="page-button"
    :class="[props['type'], direction]"
    @click.stop="handleClick">
    <slot>
      <img class="icon" :src="buttonAtr['icon'] || icon" alt="" />
      <span class="label" :class="type">{{ buttonAtr["label"] || label }}</span>
    </slot>
  </el-button>
</template>

<style lang="scss">
@import "src/styles/variables";
.page-button {
  background-color: v-bind(bgColor);
  padding: 8px 10px;
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  &:hover {
    background-color: v-bind(bgColor);
    opacity: 0.7;
  }
  &.horizontal {
    border: none;
    height: auto;
    padding: 0;
    & + .horizontal {
      margin-left: 20px;
    }
    & > span {
      display: flex;
      flex-direction: column;
    }
    &:hover {
      opacity: 1;
    }
    .icon {
      margin: {
        right: 0;
        top: 0;
        bottom: 8px;
        left: 0;
      }
    }
    .label {
      font-size: 12px;
    }
  }
}
</style>
