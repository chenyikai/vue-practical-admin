<script>
export default {
  name: "PageDialog",
};
</script>

<script setup>
import { debounce } from "lodash";
import { ref, useAttrs } from "vue";
const emits = defineEmits({
  submit: null,
});
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
    isSubmit.value.true = false;
    emits("submit", (flag) => {
      if (flag) {
        close();
        isSubmit.value = false;
      }
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
    class="form-dialog"
    v-model="visible"
    title="弹窗"
    width="800"
    draggable
    overflow
    :before-close="handleClose"
    v-bind="attrs"
    @close="close">
    <slot> </slot>
    <template #footer>
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
    margin-right: 0;
    background-color: var(--theme-color);
    &btn {
      top: 15px;
      right: 10px;
      width: 19px;
      height: 19px;
      color: #fff;
      .el-dialog__close {
        color: #fff;
        font-weight: bold;
      }
    }
  }
  .el-dialog__body {
  }
  .el-dialog__footer {
  }
}
</style>
