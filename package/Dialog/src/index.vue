<script>
export default {
  name: "PageDialog",
};
</script>

<script setup>
import { debounce } from "lodash";
import { ref, useAttrs } from "vue";
defineProps({
  showFooter: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits({
  submit: null,
});
const pageDialog = ref({});
const attrs = useAttrs();
const visible = ref(false);
const isSubmit = ref(false);

function open() {
  visible.value = true;
}

function close() {
  handleClose();
  visible.value = false;
}

const handleConfirm = debounce(
  function () {
    isSubmit.value = true;
    emits("submit", (flag) => {
      if (flag) {
        close();
      }

      isSubmit.value = false;
    });
  },
  500,
  {
    leading: true,
    trailing: false,
  },
);

function handleClose() {
  visible.value = false;
}

defineExpose({
  open,
  close,
});
</script>

<template>
  <el-dialog
    ref="pageDialog"
    class="form-dialog"
    v-model="visible"
    title="弹窗"
    width="800"
    draggable
    overflow
    :before-close="handleClose"
    v-bind="attrs"
    @close="close">
    <div class="form-dialog-content" v-loading="loading">
      <slot> </slot>
    </div>
    <template #footer v-if="showFooter && !loading">
      <div class="dialog-footer">
        <el-button
          type="primary"
          @click.stop="handleConfirm"
          :loading="isSubmit"
          :disabled="isSubmit"
          >保存</el-button
        >
        <el-button @click.stop="close">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.form-dialog {
  border-radius: 8px;
  overflow: hidden;
  .el-dialog__header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 44px;
    margin-right: 0;
    background-color: var(--theme-color);
    margin-bottom: 10px;
    .el-dialog__title {
      margin-left: 10px;
    }
    &btn {
      top: 15px;
      right: 10px;
      width: 19px;
      height: 19px;
      color: #fff;
      .el-dialog__close {
        color: var(--font-color);
        font-weight: bold;
      }
    }
  }
  .el-dialog__body {
    padding: 10px;
  }
  .el-dialog__footer {
    padding: 10px;
  }
}
</style>
