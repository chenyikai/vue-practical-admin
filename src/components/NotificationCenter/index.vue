<script>
export default {
  name: "NotificationCenter",
};
</script>

<script setup>
import { Bell } from "@element-plus/icons-vue";
defineOptions({
  name: "NotificationCenter",
});
</script>

<template>
  <el-popover
    placement="bottom"
    trigger="click"
    width="max-content"
    class="notification-popover"
    popper-class="notification-center-popover">
    <template #reference>
      <el-badge :value="200" :max="99">
        <div class="btn-layout">
          <el-icon :size="20"><Bell /></el-icon>
        </div>
      </el-badge>
    </template>
    <template #default>
      <el-tabs type="border-card" class="notification-tabs">
        <el-tab-pane label="消息">User</el-tab-pane>
        <el-tab-pane label="通知">Config</el-tab-pane>
        <el-tab-pane label="代办">Role</el-tab-pane>
      </el-tabs>
    </template>
  </el-popover>
</template>

<style lang="scss">
.notification-popover {
}
</style>
