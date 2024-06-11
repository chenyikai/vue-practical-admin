<script>
export default {
  name: "FileDialog",
};
</script>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { importDataPoiTInfo } from "@/api/data-manage/index.js";
import SvgIcon from "package/SvgIcon/src/index.vue";
import PageDialog from "package/Dialog/src/index.vue";
defineOptions({
  name: "FileDialog",
});
const emits = defineEmits({
  refresh: null,
});

const dialog = ref({});
const progress = ref(0);
const loading = ref(false);

function open() {
  dialog.value.open();
}

function uploadFile({ file, onProgress }) {
  const data = new FormData();
  data.append("file", file);
  return importDataPoiTInfo(data, onProgress);
}

function onSuccess(val, test, response) {
  loading.value = false;

  const data = response.at(-1).response.data;
  if (data.code === 200) {
    ElMessage({
      message: "导入成功",
      type: "success",
      duration: 2000,
    });
    emits("success", data);
    dialog.value.close();
  } else {
    ElMessage({
      message: data.importRestlt.result,
      type: "error",
      duration: 2000,
      showClose: true,
    });
  }
}

function onProgress(e) {
  const val = e.progress.toFixed(4);
  progress.value = Number(val * 100).toFixed(2);
  loading.value = true;
}

function beforeUpload(file) {
  const flag =
    file.type === "application/vnd.ms-excel" ||
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!flag) {
    ElMessage({
      message: "请上传excel文件!",
      type: "warning",
    });
  }
  return flag;
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog width="550px" title="文件上传" ref="dialog" :show-footer="false">
    <el-upload
      drag
      accept=".xls, .xlsx"
      action="#"
      :before-upload="beforeUpload"
      :http-request="uploadFile"
      :on-success="onSuccess"
      :on-progress="onProgress"
      :show-file-list="false">
      <div class="box">
        <template v-if="loading">
          <div
            style="
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            ">
            <svg-icon name="loading" style="width: 55px; height: 55px" />
            <span
              class="text"
              style="color: #fff; font-size: 16px; margin-top: 20px"
              >导入中...</span
            >
          </div>
        </template>
        <template v-else>
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            托拽文件到此处或者 <em>点击此次上传</em>
          </div>
        </template>
        <!--        <template v-else-if="progress !== 0 && !loading">-->
        <!--          <el-progress-->
        <!--            :percentage="progress"-->
        <!--            :stroke-width="15"-->
        <!--            striped-->
        <!--            striped-flow />-->
        <!--          <div style="margin-top: 10px" class="el-upload__text">文件上传中</div>-->
        <!--        </template>-->
      </div>
      <template #tip>
        <div class="el-upload__tip">只可以上传excel文件</div>
      </template>
    </el-upload>
  </page-dialog>
</template>

<style scoped lang="scss">
.file-upload-box {
  width: 400px;
  height: 400px;
  border: 1px dashed black;
}
</style>
