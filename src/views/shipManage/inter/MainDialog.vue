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
import {
  getShipTeamByDept,
  getDeptTree,
  getShipByKeyword,
  detailInnerShip,
} from "./api.js";

const deptList = ref([]);
const teamList = ref([]);
onMounted(() => {
  // 获取部门接口
  getDeptTree().then(({ data }) => {
    let deptArr = [];
    for (let i = 0; i < data.data.length; i++) {
      if (!data.data[i].children.length) {
        deptArr.push(data.data[i]);
      } else if (data.data[i].children.length) {
        data.data[i].children.forEach((item) => {
          deptArr.push(item);
        });
      }
    }
    deptList.value = deptArr;
    console.log(deptList.value, "   deptList.value");
  });
});
// 选择部门回调
function handleDept(val) {
  //  根据部门id获取船队列表
  getShipTeamByDept({ id: val }).then(({ data }) => {
    teamList.value = data.data;
  });
}
const options = ref([]);
// 船舶关键词远程搜索
function remoteMethod(query) {
  if (query !== "") {
    loading.value = true;
    getShipByKeyword({ keyword: query }).then(({ data }) => {
      loading.value = false;
      const info = data.data.data;
      options.value = info.map((item) => {
        return {
          name: item.cnname || item.enname || "",
          mmsi: item.mmsi,
        };
      });
    });
  } else {
    options.value = [];
  }
}
// 船舶选择回调
function handleShipChange(val) {
  formData.value.mmsi = val;
  const item = options.value.find((item) => item.mmsi == val);
  formData.value.shipName = item.name;
}
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
  detailFunc.value = detailInnerShip;
  if (status.value !== "create") {
    getShipTeamByDept({ id: data.deptId }).then(({ data }) => {
      teamList.value = data.data;
    });
  }
  setData(status, data);
  formOption.disabled = isDetail.value;

  switch (status) {
    case website.pageStatus.CREATE:
      title.value = "新增内部船舶";
      break;
    case website.pageStatus.UPDATE:
      title.value = "编辑内部船舶";
      break;
    case website.pageStatus.DETAIL:
      title.value = "内部船舶详情";
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
        <!-- 船名 -->
        <template #shipName>
          <el-select
            v-model="formData.shipName"
            filterable
            clearable
            remote
            :disabled="disabled"
            reserve-keyword
            placeholder="请输入船名"
            @change="handleShipChange"
            :remote-method="remoteMethod"
            allow-create
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.mmsi"
              :label="item.name"
              :value="item.mmsi">
            </el-option>
          </el-select>
        </template>
        <!-- 部门 -->
        <template #deptId>
          <el-select
            v-model="formData.deptId"
            :disabled="disabled"
            clearable
            placeholder="请选择部门"
            @change="handleDept">
            <el-option
              v-for="item in deptList"
              :key="item.id"
              :label="item.deptName"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <!-- 船队 -->
        <template #teamId>
          <el-select
            v-model="formData.teamId"
            :disabled="disabled"
            clearable
            placeholder="请选择船队">
            <el-option
              v-for="item in teamList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select> </template
      ></avue-form>
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
