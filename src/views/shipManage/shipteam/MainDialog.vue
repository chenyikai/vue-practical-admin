<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import { ref, onBeforeMount, onMounted } from "vue";
import useForm from "@/hooks/useForm.js";
import { nextTick, computed } from "vue";
import { formOption } from "./options.js";
import website from "@/config/website.js";
import PageDialog from "package/Dialog/src/index.vue";
import { getDeptTree, reqGetShipTeamDetail } from "./api.js";
import useUserStore from "@/store/module/userStore.js";

const deptList = ref([]);
const userStore = useUserStore();
onMounted(() => {
  // 获取部门接口
  getDeptTree().then(({ data }) => {
    let deptArr = [];
    const arr = userStore.userInfo.deptidsstr.split(",");
    for (let i = 0; i < data.data.length; i++) {
      if (!data.data[i].children.length) {
        deptArr.push(data.data[i]);
      } else if (data.data[i].children.length) {
        data.data[i].children.forEach((item) => {
          deptArr.push(item);
        });
      }
    }
    deptList.value = arr.map((item) => {
      return deptArr.find((i) => i.id === item);
    });
  });
});

const disabled = computed(() => {
  return status.value == "detail";
});
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
  detailFunc.value = reqGetShipTeamDetail;
  setData(status, data);
  formOption.disabled = isDetail.value;

  switch (status) {
    case website.pageStatus.CREATE:
      title.value = "新增船队";
      break;
    case website.pageStatus.UPDATE:
      title.value = "编辑船队";
      break;
    case website.pageStatus.DETAIL:
      title.value = "船队详情";
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
    width="800"
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
        @submit="onFormSubmit">
        <template #color>
          <div class="color-box">
            <el-color-picker v-model="formData.color" :color-format="'hex'" />
            <div class="text">{{ formData.color || "无颜色" }}</div>
          </div>
        </template>
        <!-- 部门 -->
        <template #deptId>
          <el-select
            v-model="formData.deptId"
            :disabled="disabled"
            clearable
            placeholder="请选择部门">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </avue-form>
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
