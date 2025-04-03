<script>
export default {
  name: "PictureCardUpload",
};
</script>

<script setup>
import { Plus } from "@element-plus/icons-vue";

defineOptions({
  name: "PictureCardUpload",
});
</script>

<template>
  <div class="upload-layout picture-card-layout">
    <el-icon><Plus /></el-icon>
  </div>
</template>
