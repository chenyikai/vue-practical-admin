<script>
export default {
  name: "EntryMainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { dictItemFormOption } from "./options.js";
import website from "@/config/website.js";
import { dictEntryDetail } from "@/api/sys/dict/index.js";
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
function open(status, data = {}) {
  dialog.value.open();
  detailFunc.value = dictEntryDetail;
  setData(status, data);
  dictItemFormOption.disabled = isDetail.value;

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
    title="字典项管理"
    ref="dialog"
    @submit="onDialogSubmit"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form
      ref="form"
      :key="key"
      :option="dictItemFormOption"
      v-model="formData"
      @submit="onFormSubmit" />
  </page-dialog>
</template>
