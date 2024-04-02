<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import website from "@/config/website.js";
import { deptDetail } from "@/api/sys/dept/index.js";
import useOptions from "./useOptions.js";
const props = defineProps({
  departTreeData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const {
  key,
  form,
  loading,
  formStatus,
  dialog,
  formData,
  isDetail,
  detailFunc,
  setData,
} = useForm();
const { formOption, setColumnData } = useOptions();

function open(status, data = {}) {
  dialog.value.open();

  detailFunc.value = deptDetail;
  setData(status, data);
  setColumnData("parentId", "dicData", props.departTreeData);
  formOption.disabled = isDetail.value;

  nextTick().then(() => {
    form.value.clearValidate();
  });
}

function onDialogSubmit() {
  form.value.submit();
}

function onFormSubmit(data, done) {
  dialog.value.onLoad();

  emits(formStatus.value, formData.value, (isClose = false) => {
    done();
    dialog.value.onDone(isClose);
  });
}

function onClose() {
  form.value.resetForm(true);
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    title="部门管理"
    ref="dialog"
    @submit="onDialogSubmit"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form
      ref="form"
      :key="key"
      :option="formOption"
      v-model="formData"
      @submit="onFormSubmit" />
  </page-dialog>
</template>
