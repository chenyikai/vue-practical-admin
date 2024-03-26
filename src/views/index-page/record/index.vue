<script>
export default {
  name: "RecordCard",
};
</script>

<script setup>
import { Expand } from "@element-plus/icons-vue";
import website from "@/config/website.js";
import { ElMessage, ElMessageBox } from "element-plus";
import { computed, toRef } from "vue";
import useCrud from "@/hooks/useCrud.js";
import MainDialog from "./MainDialog.vue";
import {
  createMenu,
  deleteMenuById,
  updateMenu,
} from "@/api/sys/menu/index.js";
import useOptions from "./useOptions.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits({ "update:modelValue": null });

const { shortCrudOption, longCrudOption } = useOptions();
const pageInfo = {
  icon: new URL("./tuban.svg", import.meta.url),
  label: "图斑管理",
};
const crudOption = computed(() => {
  return props.modelValue.value ? shortCrudOption : longCrudOption;
});

const {
  crud,
  dialog,
  pagination,
  mainTableData,
  tableLoading,
  getList,
  sortChange,
  sizeChange,
  handleFilter,
  currentChange,
} = useCrud();

const menuTreeData = computed(() => [
  {
    menuName: "根节点",
    id: "-1",
    children: toRef(mainTableData).value,
  },
]);

function onAdd(rowData) {
  if (rowData) {
    dialog.value.open(website.pageStatus.CREATE, {
      id: undefined,
      parentId: rowData.id,
    });
  } else {
    dialog.value.open(website.pageStatus.CREATE);
  }
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除菜单：${rowData.menuName}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteMenuById(rowData.id);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onDetail(rowData) {
  dialog.value.open(website.pageStatus.DETAIL, rowData);
}

function onCreateSubmit(formData, done) {
  createMenu(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "新增失败",
        type: "error",
      });
      done();
    });
}

function onUpdateSubmit(formData, done) {
  updateMenu(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
      done();
    });
}

function handleShrink() {
  emits("update:modelValue", !props.modelValue);
}
</script>

<template>
  <page-container
    class="record-page-container"
    :pageInfo="pageInfo"
    style="padding: 0">
    <template #title>
      <el-icon
        class="shrink-btn"
        :shrink="{ shrink: modelValue }"
        @click.stop="handleShrink"
        ><Expand
      /></el-icon>
    </template>
    <template #crud>
      <avue-crud
        ref="crud"
        :page="pagination"
        :option="crudOption"
        :data="mainTableData"
        :table-loading="tableLoading"
        @size-change="sizeChange"
        @current-change="currentChange"
        @sort-change="sortChange">
        <template v-slot:menu="{ row }">
          <page-button
            type="create"
            direction="horizontal"
            @click.stop="onAdd(row)" />
          <page-button
            type="detail"
            direction="horizontal"
            @click.stop="onDetail(row)" />
          <page-button
            type="update"
            direction="horizontal"
            @click.stop="onUpdate(row)" />
          <page-button
            type="delete"
            direction="horizontal"
            @click.stop="onDelete(row)" />
        </template>
      </avue-crud>
    </template>
    <template #dialog>
      <main-dialog
        ref="dialog"
        :menu-tree-data="menuTreeData"
        @[website.pageStatus.CREATE]="onCreateSubmit"
        @[website.pageStatus.UPDATE]="onUpdateSubmit" />
    </template>
  </page-container>
</template>

<style lang="scss">
.record-page-container {
  .shrink-btn {
    width: 25px;
    cursor: pointer;
    transition: all 0.3s;
    &.shrink {
      transform: rotate(180deg);
    }
  }
}
</style>
