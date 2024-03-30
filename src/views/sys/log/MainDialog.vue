<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { formOption } from "./options.js";
import { logDetail } from "@/api/sys/log/index.js";
const { form, loading, dialog, formData, isDetail, detailFunc, setData } =
  useForm();

function open(status, data = {}) {
  detailFunc.value = logDetail;
  setData(status, data);
  formOption.disabled = isDetail.value;

  dialog.value.open();
  nextTick().then(() => {
    form.value.clearValidate();
  });
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    title="用户管理"
    ref="dialog"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
