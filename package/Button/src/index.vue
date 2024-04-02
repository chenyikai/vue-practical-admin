<script>
export default {
  name: "PageButton",
};
</script>

<script setup>
import { readonly, computed, reactive } from "vue";
import { validatenull } from "@/utils/validate.js";
import SvgIcon from "package/SvgIcon/src/index.vue";
const emits = defineEmits({
  click: null,
});
// const themeColor = useCssVar("--theme-color");
const buttonMap = readonly({
  search: {
    icon: "search",
    label: "搜索",
  },
  reset: {
    icon: "reset",
    label: "重置",
  },
  create: {
    icon: "create",
    label: "新增",
    // bgColor: themeColor.value,
    fontColor: "#fff",
  },
  delete: {
    icon: "delete",
    label: "删除",
  },
  update: {
    icon: "update",
    label: "更新",
  },
  detail: {
    icon: "detail",
    label: "详情",
  },
  export: {
    icon: "export",
    label: "导出",
  },
  import: {
    icon: "import",
    label: "导入",
  },
  download: {
    icon: "download",
    label: "下载",
  },
  pic: {
    icon: "pic",
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
        "import",
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
      <svg-icon class="icon" :name="buttonAtr['icon'] || icon" />
      <span class="label" :class="type">{{ buttonAtr["label"] || label }}</span>
    </slot>
  </el-button>
</template>

<style lang="scss">
@import "src/styles/variables";
.page-button {
  padding: 8px 10px;
  .icon {
    width: 18px;
    height: 18px;
    margin-right: 4px;
  }
  &:hover {
    opacity: 0.7;
  }
  &.horizontal {
    border: none;
    height: auto;
    padding: 0;
    background-color: transparent;
    & + .horizontal {
      margin-left: 20px;
    }
    & > span {
      display: flex;
      flex-direction: column;
    }
    &:hover {
      background-color: transparent !important;
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
