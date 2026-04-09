<script>
export default {
  name: "UserInfoDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm";
import useOptions from "./useOptions";
import { nextTick } from "vue";
import website from "@/config/website";
import { userDetail } from "@/api/sys/user/index";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const { key, form, detailFunc, loading, formStatus, dialog, formData, isDetail, setData } =
  useForm();

const { formOption } = useOptions();

function open(status, data = {}) {
  detailFunc.value = userDetail;
  setData(status, data);

  dialog.value.open();
  nextTick().then(() => {
    form.value.clearValidate();
  });
}

function handleSubmit(done) {
  form.value.validate((valid) => {
    if (!valid) {
      done();
      return;
    }

    if (valid) {
      emits(formStatus.value, formData.value, done);
    }
  });
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    title="用户信息"
    ref="dialog"
    @submit="handleSubmit"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :key="key" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
