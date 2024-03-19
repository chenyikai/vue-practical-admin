<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm.js";
import { nextTick, computed, defineEmits, toRef } from "vue";
import { formOption } from "./options.js";
import website from "@/config/website.js";
import { userDetail } from "@/api/sys/user/index.js";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
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
  loading,
  formStatus,
  dialog,
  formData,
  isDetail,
  detailFunc,
  setData,
} = useForm();

const options = computed(() => {
  const { column } = formOption;
  return {
    ...formOption,
    column: column.map((item) => {
      if (item.needMenuData) {
        return {
          dicData: toRef(props.menuTreeData),
          disabled: isDetail.value,
          ...item,
        };
      } else {
        return {
          disabled: isDetail.value,
          ...item,
        };
      }
    }),
  };
});

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
    title="菜单管理"
    ref="dialog"
    @submit="handleSubmit"
    :loading="loading"
    :show-footer="!isDetail">
    <avue-form ref="form" :option="options" v-model="formData" />
  </page-dialog>
</template>
