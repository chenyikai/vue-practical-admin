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
import SkeletonForm from "package/Skeleton/src/index.vue";
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
  detailFunc.value = dictDetail;

  setData(status, data).then(() => {
    formOption.disabled = isDetail.value;
    // nextTick().then(() => {
    //   form.value.clearValidate();
    // });
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
  form.value.resetForm();
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
    :show-footer="!isDetail">
    <skeleton-form
      :option="formOption"
      :loading="true"
      animated
      :throttle="{ leading: 500, initVal: true }">
      <avue-form
        ref="form"
        :key="key"
        :option="formOption"
        v-model="formData"
        @submit="onFormSubmit" />
    </skeleton-form>
  </page-dialog>
</template>
