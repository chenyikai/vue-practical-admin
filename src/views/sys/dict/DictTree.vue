<script>
export default {
  name: "DictTree",
};
</script>

<script setup>
import { useTemplateRef, onBeforeMount, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import useCrud from "@/hooks/useCrud";
import MainDialog from "./MainDialog.vue";
import website from "@/config/website";
import { ElMessage, ElMessageBox } from "element-plus";
import { createDict, getDictList, updateDict } from "@/api/sys/dict/index";
import { deleteDeptById } from "@/api/sys/dept/index";

const { dialog, funcList, mainTableData, tableLoading, getList, handleFilter } = useCrud();

const emit = defineEmits(["node-click"]);

defineOptions({
  name: "DictTree",
});

const keyword = ref("");

const treeRef = useTemplateRef("tree");

watch(keyword, (val) => {
  treeRef.value?.filter(val);
});

const filterNode = (value, data) => {
  if (!value) {
    return true;
  }
  return data.remarks.includes(value);
};

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE);
}

function onCreateSubmit(formData, done) {
  createDict(formData)
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
  updateDict(formData)
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

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onDelete(rowData) {
  ElMessageBox.confirm(`是否确认删除字典：${rowData.remarks}？`, "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return deleteDeptById(rowData.id);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onNodeClick(data) {
  emit("node-click", data);
}

onBeforeMount(() => {
  funcList.list = getDictList;
  getList();
});
</script>

<template>
  <div class="dict-tree-container" v-loading="tableLoading">
    <el-button type="primary" :icon="Plus" class="add-btn" @click.stop="onAdd"
      >新增字典分类</el-button
    >
    <el-input v-model="keyword" placeholder="请输入字典名称" />
    <el-tree
      ref="tree"
      :data="mainTableData"
      :filter-node-method="filterNode"
      :props="{ label: 'remarks', value: 'id' }"
      default-expand-all
      @node-click="onNodeClick">
      <template #default="{ node, data }">
        <div class="dict-tree-node">
          <span class="tree-label">{{ node.label }}</span>
          <el-button-group class="tree-btn-group">
            <el-button type="primary" plain link @click.stop="onUpdate(data)">编辑</el-button>
            <el-button type="danger" plain link @click.stop="onDelete(data)">删除</el-button>
          </el-button-group>
        </div>
      </template>
    </el-tree>

    <main-dialog
      ref="dialog"
      @[website.pageStatus.CREATE]="onCreateSubmit"
      @[website.pageStatus.UPDATE]="onUpdateSubmit" />
  </div>
</template>

<style lang="scss" scoped>
.dict-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 256px;
  .tree-label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tree-btn-group {
    display: flex;
    gap: 10px;
  }
}
</style>

<style scoped lang="scss">
.dict-tree-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
