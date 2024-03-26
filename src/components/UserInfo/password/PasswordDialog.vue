<script>
export default {
  name: "PasswordDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import useOptions from "./useOptions.js";
import { nextTick } from "vue";
import website from "@/config/website.js";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const { form, loading, formStatus, dialog, formData, isDetail, setData } =
  useForm();

const { formOption, setRule } = useOptions();

function open(status, data = {}) {
  setData(status, data);
  setRule("newPassword1", [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (formData.value.newPassword !== value) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
    },
  ]);

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
    title="修改密码"
    ref="dialog"
    @submit="handleSubmit"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
