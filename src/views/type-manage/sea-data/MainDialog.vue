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
import { detailPoiTType } from "@/api/type-manage/index.js";
import { getPoiTAttributeList } from "@/api/attribute-manage/index.js";

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
const eltableRef = ref(null);
const tableDic = ref([]);
const tableData = ref([]);

function open(status, data = {}) {
  detailFunc.value = detailPoiTType;
  setData(status, data).then(() => {
    setTableData();
  });
  formOption.disabled = isDetail.value;

  switch (status) {
    case website.pageStatus.CREATE:
      title.value = "新增类型";
      break;
    case website.pageStatus.UPDATE:
      title.value = "编辑类型";
      break;
    case website.pageStatus.DETAIL:
      title.value = "类型详情";
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

  emits(
    formStatus.value,
    { ...formData.value, attributeVoList: tableData.value },
    (isClose = false) => {
      done();
      dialog.value.onDone(isClose);
    },
  );
}

function onClose() {
  form.value.resetForm(true);
  eltableRef.value.clearSelection();
  tableDic.value = tableDic.value.map((obj) => {
    return { ...obj, forcedInput: 0 };
  });
}

function handleSelectionChange() {
  // 表格多选回调
  const e = eltableRef.value.getSelectionRows();
  let data = [];
  e.map((item) => {
    data.push({
      id: item.id ? item.id : null,
      attributeId: item.attributeId,
      attributeName: item.attributeName,
      forcedInput: item.forcedInput,
      source: 1,
    });
  });
  tableData.value = data;
}

function setTableData() {
  // 表格写入
  if (formStatus.value === website.pageStatus.UPDATE) {
    formData.value.attributeVoList.map((item) => {
      tableDic.value.map((e, i) => {
        if (item.id && item.attributeId === e.attributeId) {
          tableDic.value[i].id = item.id;
          tableDic.value[i].forcedInput = item.forcedInput;
          eltableRef.value.toggleRowSelection(tableDic.value[i], true);
        }
      });
    });
  }
}

onBeforeMount(() => {
  getPoiTAttributeList().then(({ data }) => {
    tableDic.value = data.data.map((item) => {
      return {
        ...item,
        attributeId: item.id,
      };
    });
  });
});

defineExpose({
  open,
});
</script>

<template>
  <page-dialog
    :title="title"
    width="700"
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
      <div class="association-data">
        <el-table
          ref="eltableRef"
          :data="tableDic"
          style="width: 100%"
          height="250"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" />
          <el-table-column prop="attributeName" label="名称" width="180" />
          <el-table-column prop="attributeCode" label="编码" />
          <el-table-column prop="attributeType" label="数据类型" />
          <el-table-column prop="forcedInput" label="是否必填">
            <template #default="scope">
              <el-switch
                v-model="scope.row.forcedInput"
                inline-prompt
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                active-text="Y"
                inactive-text="N"
                :active-value="1"
                :inactive-value="0"
                @change="handleSelectionChange" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </page-dialog>
</template>

<style scoped lang="scss">
.form-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .association-data {
    padding: 0 10px;
  }
}
</style>
