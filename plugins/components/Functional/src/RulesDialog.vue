<script>
import crudMixin from "@/mixins/crudMixin";
import {
  ptElectricFenceRuleAdd,
  ptElectricFenceRuleDelete,
  ptElectricFenceRulePage,
  ptElectricFenceRuleUpdate,
} from "@/api/fence";
import AddDialog from "./addDialog.vue";
import Vue from "vue";
const AddDialogVue = Vue.extend(AddDialog);
const dialog = new AddDialogVue().$mount();

export default {
  name: "RulesDialog",
  data() {
    return {
      fenceId: null,
      crudOption: {
        header: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        index: true,
        border: true,
        stripe: true,
        menu: false,
        headerAlign: "center",
        align: "center",
        height: "300px",
        column: [
          {
            label: "点位",
            prop: "nextPoint",
          },
          {
            label: "距离",
            prop: "distance",
          },
          {
            label: "音频",
            prop: "name",
          },
          {
            label: "航向",
            prop: "course",
            dataType: "string",
            dicData: [
              {
                label: "往",
                value: true,
              },
              {
                label: "返",
                value: false,
              },
            ],
          },
          {
            label: "操作",
            prop: "menu",
            slot: true,
            width: 200,
          },
        ],
      },
    };
  },
  mixins: [crudMixin],
  mounted() {
    dialog.$on("create", this.handleCreateSubmit);
    dialog.$on("update", this.handleUpdateSubmit);
  },
  beforeDestroy() {
    dialog.$off("create");
    dialog.$off("update");
  },
  methods: {
    open(id) {
      this.fenceId = id;
      this.$refs.dialog.open();
      this.getList();
    },
    getList() {
      this.tableLoading = true;
      this.$set(this.listQuery, "fenceId", this.fenceId);
      ptElectricFenceRulePage(this.queryWrapper).then(({ data }) => {
        this.mainTableData = data.data.rows;
        this.$set(this.pagination, "total", Number(data.data.total));
        this.tableLoading = false;
      });
    },
    close() {
      this.$refs.dialog.close();
    },
    handleCreate() {
      dialog.open({}, "create");
    },
    handleUpdate(rowData) {
      dialog.open(
        {
          ...rowData,
          voiceUrl: [{ label: rowData.name, value: rowData.voiceUrl }],
        },
        "update"
      );
    },
    handleDetail(rowData) {
      dialog.open(rowData, "detail");
    },
    handleDelete(rowData) {
      this.$confirm(`是否确认删除规则`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return ptElectricFenceRuleDelete(rowData.id);
        })
        .then(() => {
          this.$message.success("删除成功!");
          this.getList();
        })
        .catch(() => {});
    },
    handleCreateSubmit(formData, done) {
      ptElectricFenceRuleAdd({ ...formData, fenceId: this.fenceId })
        .then(() => {
          done(true);
          this.getList();
        })
        .catch(() => {
          done();
        });
    },
    handleUpdateSubmit(formData, done) {
      ptElectricFenceRuleUpdate({ ...formData, fenceId: this.fenceId })
        .then(() => {
          done(true);
          this.$message.success("修改成功");
          this.getList();
        })
        .catch(() => {
          done();
        });
    },
  },
};
</script>

<template>
  <AochenDialog
    ref="dialog"
    title="添加播报规则"
    :showFooter="false"
    customClass="rules-dialog">
    <AochenContainer>
      <AochenControlBar title="规则管理" :total="pagination.total">
        <AochenButton type="create" @click="handleCreate" />
      </AochenControlBar>
      <div class="crud-layout">
        <avue-crud
          ref="crud"
          :page.sync="pagination"
          :option="crudOption"
          :data="mainTableData"
          :table-loading="tableLoading"
          @size-change="sizeChange"
          @current-change="currentChange"
          @sort-change="sortChange">
          <template slot="menu" slot-scope="{ row }">
            <AochenButton type="update" @click="handleUpdate(row)" />
            <AochenButton type="detail" @click="handleDetail(row)" />
            <AochenButton type="delete" @click="handleDelete(row)" />
          </template>
        </avue-crud>
      </div>
    </AochenContainer>
  </AochenDialog>
</template>

<style scoped lang="scss"></style>
