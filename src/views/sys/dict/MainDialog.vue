<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { formOption } from "./options.js";
import website from "@/config/website.js";
import { dictDetail } from "@/api/sys/dict/index.js";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const {
  form,
  loading,
  formStatus,
  dialog,
  formData,
  isDetail,
  detailFunc,
  setData,
} = useForm();

function open(status, data = {}) {
  dialog.value.open();
  detailFunc.value = dictDetail;
  setData(status, data);
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
    title="字典管理"
    ref="dialog"
    @submit="onDialogSubmit"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form
      ref="form"
      :option="formOption"
      v-model="formData"
      @submit="onFormSubmit" />
  </page-dialog>
</template>
