<script>
import { validatenull } from "@/util/validate";
import { dealMessage } from "@/api/alarm";

export default {
  name: "AlarmDialog",
  data() {
    return {
      formData: {},
      formOption: {
        menuBtn: false,
        labelWidth: 120,
        labelPosition: "right",
        column: [
          {
            label: "船名",
            prop: "shipName",
            span: 12,
            disabled: true,
          },
          {
            label: "MMSI",
            prop: "mmsi",
            span: 12,
            disabled: true,
          },
          {
            label: "负责人",
            span: 12,
            prop: "manage",
            disabled: true,
          },
          {
            label: "预警类型",
            prop: "alarmType",
            type: "select",
            span: 12,
            disabled: true,
            dicData: [
              {
                label: "人数",
                value: "1",
              },
              {
                label: "穿戴",
                value: "2",
              },
              {
                label: "瞌睡",
                value: "3",
              },
              {
                label: "陌生人闯入",
                value: "4",
              },
            ],
          },
          {
            label: "内容",
            prop: "context",
            span: 24,
            type: "textarea",
            disabled: true,
          },
          {
            label: "告警图片",
            prop: "pic",
            span: 24,
          },
        ],
      },
    };
  },
  methods: {
    open(data) {
      this.formData = data;
      this.$refs.dialog.open();
    },
    handleClosed() {
      this.$refs.dialog.close();
      this.$refs.form.resetForm();
    },
    handleDeal() {
      this.$prompt("请输入处理意见", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (val) => {
          return validatenull(val) ? "请输入处理意见" : true;
        },
      }).then(({ value }) => {
        dealMessage({
          content: value,
          id: this.formData.id,
        }).then(() => {
          this.$message.success("操作成功");
          this.$emit("refresh");
        });
      });
    },
  },
};
</script>

<template>
  <AochenDialog ref="dialog" title="预警详情" showFooter @close="handleClosed">
    <div class="button-group" slot="footer">
      <el-button type="primary" @click="handleDeal">处理</el-button>
      <el-button type="danger" @click.stop="handleClosed">关闭</el-button>
    </div>
    <avue-form ref="form" v-model="formData" :option="formOption">
      <template slot="pic">
        <el-image
          :src="formData['pic']"
          :preview-src-list="[formData['pic']]"></el-image>
      </template>
    </avue-form>
  </AochenDialog>
</template>
