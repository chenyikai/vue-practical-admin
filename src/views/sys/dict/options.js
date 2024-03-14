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
  column: [
    {
      label: "英文名称",
      prop: "type",
      width: 200,
    },
    {
      label: "中文描述",
      prop: "remarks",
      width: 200,
    },
    {
      label: "字典类型",
      prop: "system",
      type: "select",
      dicData: [
        { label: "系统", value: 0 },
        { label: "业务", value: 1 },
      ],
      width: 120,
    },
    {
      label: "描述",
      prop: "description",
      type: "textarea",
      overHidden: true,
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
      label: "英文名称",
      prop: "type",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "中文描述",
      prop: "remarks",
      span: 24,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "字典类型",
      prop: "system",
      type: "select",
      span: 24,
      dicData: [
        { label: "系统", value: 0 },
        { label: "业务", value: 1 },
      ],
    },
    {
      label: "描述",
      prop: "description",
      type: "textarea",
      span: 24,
      overHidden: true,
    },
  ],
};

export const dictItemCrudOption = {
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
  column: [
    {
      label: "字典项名称",
      prop: "label",
    },
    {
      label: "字典值",
      prop: "value",
    },
    {
      label: "排序",
      prop: "sort",
    },
    {
      label: "备注",
      prop: "remarks",
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
    },
  ],
};

export const dictItemFormOption = {
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "字典项名称",
      prop: "label",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "字典值",
      prop: "value",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "排序",
      prop: "sort",
      type: "number",
      span: 12,
      rules: [{ required: true, message: "不能为空" }],
    },
    {
      label: "Tip描述",
      prop: "description",
      span: 12,
    },
    {
      label: "备注",
      prop: "remarks",
      span: 24,
    },
  ],
};
