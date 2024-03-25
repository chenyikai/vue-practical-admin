<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import website from "@/config/website.js";
import useOptions from "./useOptions.js";
import { menuDetail } from "@/api/sys/menu/index.js";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const { formOption, setColumnData, setDisabled } = useOptions();

const props = defineProps({
  menuTreeData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const {
  form,
  dialog,
  loading,
  formStatus,
  formData,
  isDetail,
  detailFunc,
  setData,
} = useForm();

function open(status, data = {}) {
  detailFunc.value = menuDetail;
  setColumnData("parentId", "dicData", props.menuTreeData);
  setData(status, data);
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
    title="菜单管理"
    ref="dialog"
    @submit="handleSubmit"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
