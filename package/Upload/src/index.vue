<template>
  <section class="upload-file-container">
    <el-upload
      ref="upload"
      action="#"
      v-model:file-list="files"
      :http-request="uploadFunc"
      :before-upload="onBeforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-remove="onRemove"
      :on-change="onChange"
      :on-error="onError"
      :disabled="isDisabled"
      v-bind="bindValue">
      <drag-upload
        v-if="type === 'drag'"
        :is-upload="isUpload"
        :progress="progress"
        :colors="props.colors" />

      <avatar-upload v-if="type === 'avatar'" :src="model" :size="props.size" />

      <picture-card-upload v-if="type === 'pictureCard'" />

      <template #file="{ file }">
        <file-card
          v-if="props.type !== 'pictureCard'"
          :file="file"
          :status="results[file.uid].status"
          @delete="onDelete"
          @click="onFileClick" />

        <div v-else class="file-card-img-layout">
          <el-image :src="file.url" fit="cover" lazy />
          <span class="el-upload-list__item-status-label">
            <el-icon :size="12"><Check /></el-icon>
          </span>
          <span class="el-upload-list__item-actions func">
            <el-icon class="icon" :size="22" @click.stop="onPreview(file)"
              ><Search
            /></el-icon>
            <el-icon class="icon" :size="22" @click.stop="onDelete(file)"
              ><Delete
            /></el-icon>
          </span>
        </div>
      </template>

      <template v-if="slots.tip" #tip>
        <slot name="tip"> </slot>
      </template>
    </el-upload>
    <el-image-viewer
      v-if="visible"
      :zoom-rate="1.2"
      :max-scale="7"
      :min-scale="0.2"
      :initial-index="
        previewSrcList.findIndex((item) => item === previewFile.url)
      "
      :zIndex="nextZIndex()"
      :urlList="previewSrcList"
      @close="closeViewer" />
  </section>
</template>

<script>
export default {
  name: "UploadFile",
};
</script>

<script setup>
import { ref, useAttrs, computed, useSlots, readonly, reactive } from "vue";
import { Check, Search, Delete } from "@element-plus/icons-vue";
import request from "@/router/axios.js";
import website from "@/config/website.js";
import { ElMessageBox } from "element-plus";
import { useZIndex } from "element-plus";
import FileCard from "package/Upload/src/components/FileCard.vue";
import { STATUS } from "package/Upload/src/vars.js";
import DragUpload from "package/Upload/src/components/DragUpload.vue";
import AvatarUpload from "package/Upload/src/components/AvatarUpload.vue";
import PictureCardUpload from "package/Upload/src/components/PictureCardUpload.vue";

const { nextZIndex } = useZIndex();

const emits = defineEmits({
  success: null,
  fail: null,
  "file-click": null,
  select: null,
  change: null,
});
const status = readonly({
  SUCCESS: STATUS.SUCCESS,
  FAIL: STATUS.FAIL,
  UPLOADING: STATUS.UPLOADING,
  READY: STATUS.READY,
});
const attrs = useAttrs();
const slots = useSlots();
const model = defineModel();

const props = defineProps({
  type: {
    type: String,
    default: null,
    required: true,
    validator(value) {
      return ["drag", "avatar", "pictureCard"].includes(value);
    },
  },
  action: {
    type: String,
    default: null,
  },
  colors: {
    type: Array,
    default: () => {
      return [
        { color: "#f56c6c", percentage: 20 },
        { color: "#6f7ad3", percentage: 40 },
        { color: "#e6a23c", percentage: 60 },
        { color: "#1989fa", percentage: 80 },
        { color: "#5cb87a", percentage: 100 },
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
  ossType: {
    type: Number,
    default: null,
  },
  beforeUploadValidator: {
    type: Function,
    default: null,
  },
});
// 上传实例
const upload = ref({});
// 是否上传
const isUpload = ref(false);
// 上传进度
const progress = ref(0);
// 文件列表
const files = ref([]);
// 上传结果
const results = reactive({});
// 正在上传文件
const loadingFile = ref({});
// preview
const visible = ref(false);
// preview file
const previewFile = ref({});
// 组件绑定值
const bindValue = computed(() => {
  let properties = {};
  if (props.type === "drag") {
    properties = {
      drag: true,
      "show-file-list": true,
    };
  } else if (props.type === "avatar") {
    properties = {
      limit: 1,
      "show-file-list": false,
      accept: ".png, .jpg",
    };
  } else if (props.type === "pictureCard") {
    properties = {
      "list-type": "picture-card",
      "show-file-list": true,
      accept: ".png, .jpg",
    };
  } else {
    properties = {};
  }

  return {
    ...attrs,
    ...properties,
  };
});

const previewSrcList = computed(() => {
  return files.value.map((item) => item.url);
});

const isShowFileList = computed(() => {
  return (
    bindValue.value["show-file-list"] ||
    props["show-file-list"] ||
    props.type === "pictureCard"
  );
});

const isDisabled = computed(() => {
  return isUpload.value || attrs.disabled;
});

function setData(val) {
  files.value = val;

  files.value.forEach((file) => {
    results[file.uid] = {
      status: status.SUCCESS,
      file,
    };
  });
}

function clearData() {
  files.value = [];
  results.value = [];
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
  formData.append("ossType", props.ossType || website.upload.ossType);

  return request({
    url: props.action || website.upload.url,
    method: "post",
    onUploadProgress: option.onProgress,
    data: formData,
    timeout: 0,
  });
}

function onBeforeUpload(file) {
  if (props.beforeUploadValidator) {
    isUpload.value = props.beforeUploadValidator(file);
  } else {
    isUpload.value = true;
  }

  loadingFile.value = file;
  emits("select", loadingFile.value);

  return isUpload.value;
}

function onFileClick(file) {
  const result = results[file.uid];

  if (result.status === status.SUCCESS) {
    window.open(file.url);
  } else if (result.status === status.FAIL) {
    // TODO 失败
    ElMessageBox.confirm(`是否重新上传文件：${file.name}？`, "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
      uploadFunc({ file: result.file, data: attrs.data });
    });
  } else {
    // TODO 加载
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
 * 改变
 */
function onChangeFilesFormat() {
  files.value = files.value.map((item) => {
    if (item.response) {
      return {
        ...item,
        ...item.response.data,
        url: item.response.data.ossFullPath,
      };
    } else {
      return item;
    }
  });
}

/**
 * 成功事件
 * @param e
 */
function onSuccess(e) {
  results[loadingFile.value.uid].status = status.SUCCESS;

  if (isShowFileList.value) {
    onChangeFilesFormat();
    model.value = files.value;
  } else {
    model.value = e.data.ossFullPath;
  }

  emits("success", e);
  onFinish();
}

function onError(e, file, files) {
  // files.push(file);
  onChangeFilesFormat();
  emits("fail", e, file, files.value);
  onFinish();
}

function onPreview(file) {
  visible.value = true;
  previewFile.value = file;
}

function onDelete(file) {
  if (isDisabled.value) return;

  upload.value.handleRemove(file);
}

function onRemove(file, list) {
  console.log(file, list, files.value, "dadas");
}

function onChange(file) {
  if (results[file.uid]) {
    results[file.uid].status = file.status;
  } else {
    results[file.uid] = {
      status: status.READY,
      file: file,
    };
  }
}

function onCancel(file) {
  upload.value.abort(file);
}

function onFinish() {
  loadingFile.value = {};
  isUpload.value = false;
  progress.value = 0;
}

function closeViewer() {
  visible.value = false;
  previewFile.value = {};
}

defineExpose({
  cancel: onCancel,
  set: setData,
  clear: clearData,
});
</script>

<style lang="scss">
.upload-file-container {
}

.file-card-img-layout {
  .el-image {
    width: 100%;
    height: 100%;
  }
  .func {
    .icon {
      cursor: pointer;
      & + .icon {
        margin-left: 10px;
      }
    }
  }
}
</style>
