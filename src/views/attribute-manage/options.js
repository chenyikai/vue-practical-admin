// import { getDictData } from "@/utils/util.js";

export const dicData = [
  { label: "字符串", value: "string" },
  { label: "数字", value: "number" },
  { label: "日期时间", value: "date" },
];

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
  calcHeight: 50,
  column: [
    {
      label: "名称",
      prop: "attributeName",
    },
    {
      label: "编码",
      prop: "attributeCode",
    },
    {
      label: "数据类型",
      prop: "attributeType",
      dicData: dicData,
    },
    {
      label: "备注",
      prop: "remark",
    },
    {
      label: "最后修改时间",
      prop: "updateDate",
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
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "属性名称",
      prop: "attributeName",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "属性编码",
      prop: "attributeCode",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "数据类型",
      prop: "attributeType",
      type: "select",
      clearable: false,
      dicData: dicData,
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "备注",
      prop: "remark",
      type: "textarea",
      span: 24,
      rows: 3,
    },
  ],
};
