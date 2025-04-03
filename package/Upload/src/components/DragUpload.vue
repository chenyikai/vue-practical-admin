<script>
export default {
  name: "DragUpload",
};
</script>

<script setup>
import SvgIcon from "package/SvgIcon/src/index.vue";
import { UploadFilled } from "@element-plus/icons-vue";

defineOptions({
  name: "DragUpload",
});

const { isUpload, progress, colors } = defineProps({
  isUpload: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
  colors: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="upload-layout">
    <template v-if="!isUpload">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽文件到此或 <em>点击上传</em></div>
    </template>
    <template v-else>
      <el-progress
        striped-flow
        striped
        type="dashboard"
        :percentage="progress"
        :color="colors">
        <template #default="{ percentage }">
          <div class="upload-progress-content">
            <svg-icon class="icon" name="loading" />
            <span class="text">{{ percentage }}%</span>
          </div>
        </template>
      </el-progress>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.upload-progress-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .icon {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
}
</style>
