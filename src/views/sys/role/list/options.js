export const crudOption = {
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
  calcHeight: 10,
  column: [
    {
      label: "角色名称",
      prop: "roleName",
    },
    {
      label: "描述",
      prop: "remark",
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
      width: 200,
    },
  ],
};

export const formOption = {
  labelWidth: 100,
  labelPosition: "right",
  menuBtn: false,
  column: [
    {
      label: "角色名称",
      prop: "roleName",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "描述",
      prop: "remark",
      type: "textarea",
      span: 24,
    },
  ],
};
