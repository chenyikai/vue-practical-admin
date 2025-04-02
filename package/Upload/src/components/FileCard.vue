<script>
export default {
  name: "FileCard",
};
</script>

<script setup>
import SvgIcon from "package/SvgIcon/src/index.vue";
import {
  CircleClose,
  CircleCloseFilled,
  Loading,
  SuccessFilled,
} from "@element-plus/icons-vue";
import { STATUS } from "package/Upload/src/vars.js";

defineOptions({
  name: "FileItem",
});

const { file } = defineProps({
  file: {
    type: Object,
    default: () => {
      return {
        name: "",
      };
    },
  },
  status: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["delete", "click"]);

function getFileExtension(filename) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() : undefined;
}

function getIcon() {
  const suffix = getFileExtension(file.name);

  const fileType = {
    // word
    doc: "file-document",
    docs: "file-document",

    // excel
    xls: "file-excel",
    xlsx: "file-excel",

    // pdf
    pdf: "file-pdf",

    // zip
    zip: "file-zip",

    png: "file-pic",
    jpg: "file-pic",
    jpeg: "file-pic",

    mp4: "file-video",
    mp3: "file-audio",
  };

  return fileType[suffix] || "file-document";
}

function onDelete() {
  emit("delete", file);
}

function onClick() {
  emit("click", file);
}
</script>

<template>
  <div class="file-card" @click.stop="onClick">
    <svg-icon class="icon" :name="getIcon()" />
    <span class="label">{{ file.name }}</span>
    <el-icon v-if="STATUS.SUCCESS === status" :size="20" class="status success"
      ><SuccessFilled
    /></el-icon>
    <el-icon v-if="STATUS.FAIL === status" :size="20" class="status fail"
      ><CircleCloseFilled
    /></el-icon>
    <el-icon v-if="STATUS.READY === status" :size="20" class="status loading"
      ><Loading
    /></el-icon>
    <el-icon class="close-btn" :size="20" @click.stop="onDelete"
      ><CircleClose
    /></el-icon>
  </div>
</template>

<style scoped lang="scss">
@use "src/styles/variables" as vars;
.file-card {
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 5px;
  flex-shrink: 0;
  border: 1px dashed transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  .icon {
    width: 22px;
    height: 25px;
    flex-shrink: 0;
    margin-right: 4px;
    border-radius: 4px;
  }
  .label {
    flex: 1;
    font-size: 12px;
    @include vars.text-ellipsis(1);
  }
  .status {
    &.success {
      color: #67c23a;
    }
    &.fail {
      color: #f56c6c;
    }
  }
  .close-btn {
    display: none;
  }
  &:hover {
    .close-btn {
      display: block;
    }
    .status {
      display: none;
    }
  }
}
</style>
