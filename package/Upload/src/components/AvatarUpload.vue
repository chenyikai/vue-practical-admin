<script>
export default {
  name: "AvatarUpload",
};
</script>

<script setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

defineOptions({
  name: "AvatarUpload",
});

const { src, size } = defineProps({
  src: {
    type: String,
    default: null,
  },
});

// 头像
const avatarSize = ref(`${size}px`);
</script>

<template>
  <div class="upload-layout avatar-layout">
    <img v-if="src" :src="src" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </div>
</template>

<style lang="scss" scoped>
.avatar-layout {
  border: 1px dashed var(--el-border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 6px;
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
</style>
