<template>
  <AochenDialog
    ref="dialog"
    :title="titles[status]"
    :showFooter="status !== 'detail'"
    @closed="handleClosed"
    @submit="handleDialogSubmit">
    <avue-form
      ref="form"
      v-model="formData"
      :option="formOption"
      @submit="handleSubmit">
    </avue-form>
  </AochenDialog>
</template>

<script>
export default {
  name: "AddDialog",
  data() {
    return {
      formOption: {
        menuBtn: false,
        labelWidth: 120,
        labelPosition: "right",
        column: [
          {
            label: "点位",
            prop: "nextPoint",
            rules: [{ required: true, message: "不能为空", trigger: "blur" }],
          },
          {
            label: "距离",
            prop: "distance",
            type: "number",
            minRows: 0,
            rules: [{ required: true, message: "不能为空", trigger: "blur" }],
          },
          {
            label: "航向",
            prop: "course",
            type: "select",
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
            rules: [{ required: true, message: "不能为空", trigger: "change" }],
          },
          {
            label: "音频",
            prop: "voiceUrl",
            type: "upload",
            span: 12,
            limit: 1,
            fileSize: 100,
            propsHttp: {
              url: "previewPath",
              name: "oldFileName",
              res: "data",
            },
            headers: {
              isUpload: true,
            },
            action: `/rest/sys/file/upload`,
            rules: [{ required: true, message: "不能为空", trigger: "change" }],
          },
        ],
      },
      status: undefined,
      formData: {
        voiceUrl: [],
      },
      titles: {
        create: "新增规则",
        update: "修改规则",
        detail: "规则详情",
      },
    };
  },
  methods: {
    open(formData, status) {
      this.status = status;
      this.formData = formData;
      this.$refs.dialog.open();
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
        this.$set(this.formOption, "detail", this.status === "detail");
      });
    },
    close() {
      this.$refs.dialog.close();
    },
    handleDialogSubmit(done) {
      done();
      this.$refs.form.submit();
    },
    handleSubmit(formData, done) {
      this.$refs["dialog"].wait();
      this.$emit(
        this.status,
        {
          ...this.formData,
          voiceUrl: this.formData.voiceUrl.map((item) => item.value).toString(),
          name: this.formData.voiceUrl.map((item) => item.label).toString(),
        },
        (isClose = false) => {
          done();
          this.$refs.dialog.done(isClose);
        },
      );
    },
    handleClosed() {
      this.$refs.form.resetForm();
    },
  },
};
</script>
