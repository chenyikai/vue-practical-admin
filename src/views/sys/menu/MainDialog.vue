<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import useForm from "@/hooks/useForm";
import { nextTick } from "vue";
import website from "@/config/website";
import useOptions from "./useOptions";
import { menuDetail } from "@/api/sys/menu/index";
import IconBox from "package/IconBox/src/index.vue";
import SkeletonBox from "package/Skeleton/src/index.vue";
const emits = defineEmits({
  [website.pageStatus.CREATE]: null,
  [website.pageStatus.UPDATE]: null,
  [website.pageStatus.DETAIL]: null,
});
const { formOption, setColumnData } = useOptions();

const props = defineProps({
  menuTreeData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});
const { key, form, dialog, loading, formStatus, formData, isDetail, detailFunc, setData } =
  useForm();

function open(status, data = {}) {
  detailFunc.value = menuDetail;
  setColumnData("parentId", "dicData", props.menuTreeData);
  setData(status, data);
  formOption.disabled = isDetail.value;

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

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    title="菜单管理"
    ref="dialog"
    @submit="onDialogSubmit"
    @close="onClose"
    :show-footer="!isDetail">
    <skeleton-box :option="formOption" :loading="loading">
      <avue-form
        ref="form"
        :key="key"
        :option="formOption"
        v-model="formData"
        @submit="onFormSubmit">
        <template #icon>
          <icon-box v-model="formData.icon" />
        </template>
      </avue-form>
    </skeleton-box>
  </page-dialog>
</template>
