<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick, defineEmits } from "vue";
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
  form,
  loading,
  formStatus,
  dialog,
  formData,
  isDetail,
  detailFunc,
  setData,
} = useForm();
const { formOption, setColumnData, setDisabled } = useOptions();

function open(status, data = {}) {
  detailFunc.value = deptDetail;
  setData(status, data);
  setColumnData("parentId", "dicData", props.departTreeData);
  setDisabled(isDetail);

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
    title="部门管理"
    ref="dialog"
    @submit="handleSubmit"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
