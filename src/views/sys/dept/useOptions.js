import { reactive } from "vue";

export default () => {
  const crudOption = {
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
    height: "auto",
    calcHeight: 30,
    column: [
      {
        label: "部门机构名称",
        prop: "deptName",
        align: "left",
      },
      {
        label: "部门机构全称",
        prop: "fullName",
      },
      {
        label: "排序",
        prop: "sort",
      },
      {
        label: "备注",
        prop: "remark",
        overHidden: true,
      },
      {
        label: "操作",
        prop: "menu",
        slot: true,
      },
    ],
  };

  const formOption = reactive({
    menuBtn: false,
    labelWidth: 120,
    labelPosition: "right",
    column: [
      {
        label: "父级部门机构",
        prop: "parentId",
        type: "tree",
        span: 24,
        dicData: [],
        props: {
          label: "deptName",
          value: "id",
        },
      },
      {
        label: "部门机构名称",
        prop: "deptName",
        span: 24,
        rules: [
          {
            required: true,
            message: "部门机构名称不能为空",
            trigger: "blur",
          },
        ],
      },
      {
        label: "部门机构全称",
        prop: "fullName",
        span: 24,
        rules: [
          {
            required: true,
            message: "部门机构全称不能为空",
            trigger: "blur",
          },
        ],
      },
      {
        label: "排序",
        prop: "sort",
        span: 24,
        type: "number",
        rules: [{ required: true, message: "排序不能为空", trigger: "click" }],
      },
      {
        label: "备注",
        prop: "remark",
        span: 24,
        type: "textarea",
      },
    ],
  });

  function setColumnData(prop, key, value) {
    const index = formOption.column.findIndex((item) => item.prop === prop);
    if (index === -1) {
      console.warn("未找到该配置");
      return;
    }

    formOption.column[index][key] = value;
  }

  function setDisabled(disabled) {
    formOption.column.forEach((item) => {
      item["disabled"] = disabled;
    });
  }

  return {
    crudOption,
    formOption,
    setDisabled,
    setColumnData,
  };
};
