<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import { ref, onBeforeMount } from "vue";
import useForm from "@/hooks/useForm.js";
import { nextTick } from "vue";
import { formOption } from "./options.js";
import website from "@/config/website.js";
import PageDialog from "package/Dialog/src/index.vue";
import { detailPoiTAttribute } from "@/api/attribute-manage/index.js";

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

const title = ref("");

function open(status, data = {}) {
  detailFunc.value = detailPoiTAttribute;
  setData(status, data);
  formOption.disabled = isDetail.value;

  switch (status) {
    case website.pageStatus.CREATE:
      title.value = "新增属性";
      break;
    case website.pageStatus.UPDATE:
      title.value = "编辑属性";
      break;
    case website.pageStatus.DETAIL:
      title.value = "属性详情";
      break;
    default:
      title.value = "异常开启";
      break;
  }

  dialog.value.open();
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

onBeforeMount(() => {});

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    :title="title"
    width="500"
    ref="dialog"
    @submit="onDialogSubmit"
    @close="onClose"
    :loading="loading"
    :show-footer="!isDetail">
    <div class="form-box">
      <avue-form
        :key="key"
        ref="form"
        :option="formOption"
        v-model="formData"
        @submit="onFormSubmit" />
    </div>
  </page-dialog>
</template>

<style scoped lang="scss">
.form-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
