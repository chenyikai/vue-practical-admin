<template>
  <section class="upload-file-container">
    <el-upload
      ref="upload"
      action="#"
      :http-request="uploadFunc"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
      v-bind="{ ...attrs, ...bindValue }"
      :show-file-list="false">
      <div class="upload-layout" v-if="type === 'drag'">
        <template v-if="!isUpload">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">拖拽文件到此或 <em>点击上传</em></div>
        </template>
        <template v-else>
          <el-progress
            type="dashboard"
            :percentage="progress"
            :color="colors" />
        </template>
      </div>
      <div class="upload-layout avatar-layout" v-if="type === 'avatar'">
        <img v-if="model" :src="model" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </div>
      <template v-if="slots.tip" #tip>
        <div class="el-upload__tip">上传jpg/png文件</div>
      </template>
    </el-upload>
    <ul class="file-list-box" v-if="attrs['show-file-list']">
      <li
        class="file-card"
        v-for="item in files"
        :key="item.uid"
        @click.stop="onFileClick(item.uid)">
        <svg-icon class="icon" :name="getIcon(item.type)" />
        <span class="label">{{ item.name }}</span>
        <el-icon
          v-if="success.includes(item.uid)"
          :size="20"
          class="status success"
          ><SuccessFilled
        /></el-icon>
        <el-icon v-if="fails.includes(item.uid)" :size="20" class="status fail"
          ><CircleCloseFilled
        /></el-icon>
        <el-icon class="close-btn" :size="20" @click.stop="onClose(item)"
          ><CircleClose
        /></el-icon>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: "UploadFile",
};
</script>

<script setup>
import { ref, useAttrs, computed, useSlots } from "vue";
import {
  UploadFilled,
  SuccessFilled,
  CircleCloseFilled,
  CircleClose,
  Plus,
} from "@element-plus/icons-vue";
import request from "@/router/axios.js";
import website from "@/config/website.js";
import SvgIcon from "package/SvgIcon/src/index.vue";
const attrs = useAttrs();
const slots = useSlots();
const model = defineModel();
const props = defineProps({
  type: {
    type: String,
    default: null,
    required: true,
    validator(value) {
      return ["drag", "avatar"].includes(value);
    },
  },
  colors: {
    type: Array,
    default: () => {
      return [
        { color: "#f56c6c", percentage: 20 },
        { color: "#e6a23c", percentage: 40 },
        { color: "#5cb87a", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#6f7ad3", percentage: 100 },
      ];
    },
    validator: (val) => {
      return Array.isArray(val);
    },
  },
  size: {
    type: Number,
    default: 50,
  },
});
const upload = ref({});
const isUpload = ref(false);
const progress = ref(0);
const files = ref([]);
const success = ref([]);
const fails = ref([]);
const loadingFile = ref({});
const bindValue = computed(() => {
  if (props.type === "drag") {
    return {
      drag: true,
    };
  } else if (props.type === "avatar") {
    return {
      limit: 1,
      "show-file-list": false,
    };
  }

  return {};
});

// 头像
const avatarSize = ref(props.size + "px");

function getIcon(type) {
  const fileType = {
    // word
    doc: "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "doc",
    // excel
    "application/vnd.ms-excel": "file-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "file-excel",
  };

  return fileType[type] || "file-document";
}

function onClose(val) {
  const index = files.value.findIndex((item) => item.uid === val.uid);
  files.value.splice(index, 1);
}

function uploadFunc(option) {
  const formData = new FormData();
  if (option.data) {
    for (const [key, value] of Object.entries(option.data)) {
      if (Array.isArray(value) && value.length) formData.append(key, ...value);
      else formData.append(key, value);
    }
  }
  formData.append("file", option.file);
  formData.append("ossType", website.upload.ossType);

  return request({
    url: website.upload.url,
    method: "post",
    onUploadProgress: option.onProgress,
    data: formData,
  });
}

function onBeforeUpload(file) {
  isUpload.value = true;
  console.log(file.type, "filefilefile");

  files.value.push(file);
  loadingFile.value = file;

  return isUpload.value;
}

function onFileClick(uid) {
  const file = files.value.find((item) => item.uid === uid);
  if (success.value.includes(uid)) {
    // TODO 成功 do something
    console.log(file, "file");
  } else if (fails.value.includes(uid)) {
    // TODO 失败 重新上传
  }
}

/**
 * 进度事件
 * @param e
 */
function onProgress(e) {
  progress.value = Math.floor(e.progress * 100);
}

/**
 * 成功事件
 * @param e
 */
function onSuccess(e) {
  console.log(e, "成功");
  if (bindValue.value["show-file-list"] || props["show-file-list"]) {
    success.value.push(loadingFile.value.uid);
  } else {
    model.value = e.data.ossFullPath;
  }

  onFinish();
}

function onError(e) {
  console.log(e, "e");
  if (bindValue.value["show-file-list"] || props["show-file-list"]) {
    fails.value.push(loadingFile.value.uid);
  }

  onFinish();
}

function onFinish() {
  loadingFile.value = {};
  isUpload.value = false;
  progress.value = 0;
}
</script>

<style lang="scss">
@import "src/styles/variables";
.upload-file-container {
  .avatar-layout {
    border: 1px dashed var(--el-border-color);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border-radius: 50%;
    transition: var(--el-transition-duration-fast);
    &:hover {
      border-color: var(--el-color-primary);
    }
    .avatar {
      width: v-bind(avatarSize);
      height: v-bind(avatarSize);
      display: block;
      border-radius: 50%;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: v-bind(avatarSize);
      height: v-bind(avatarSize);
      text-align: center;
    }
  }
  .file-list-box {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    padding: 10px 0;
    overflow: auto;
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
      & + .file-card {
        margin-left: 15px;
      }
      .icon {
        width: 22px;
        height: 25px;
        flex-shrink: 0;
        margin-right: 4px;
      }
      .label {
        flex: 1;
        font-size: 12px;
        @include text-ellipsis(1);
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
        border-color: var(--el-border-color);
        .close-btn {
          display: block;
        }
        .status {
          display: none;
        }
      }
    }
  }
}
</style>
