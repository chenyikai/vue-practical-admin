import { getDictData } from "@/utils/util";

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
      label: "菜单名称",
      prop: "menuName",
      align: "left",
    },
    {
      label: "菜单类型",
      prop: "type",
      type: "select",
      dataType: "number",
      dicData: getDictData("menu_type"),
    },
    {
      label: "菜单路径",
      prop: "path",
      align: "left",
    },
    {
      label: "菜单权限",
      prop: "permissions",
    },
    {
      label: "排序",
      prop: "sort",
    },
    {
      label: "路由缓存",
      prop: "keepAlive",
      type: "select",
      dicData: [
        { label: "缓存", value: 0 },
        { label: "不缓存", value: 1 },
      ],
    },
    {
      label: "操作",
      prop: "menu",
      width: 250,
      slot: true,
    },
  ],
};

export const formOption = {
  enter: true,
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "菜单名称",
      prop: "menuName",
      rules: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
    },
    {
      label: "类型",
      prop: "type",
      type: "select",
      dataType: "number",
      dicData: getDictData("menu_type"),
      span: 12,
      change: ({ value }) => {
        if (value === 0) {
          this.$set(this.formOption.column[2], "display", true);
          this.$set(this.formOption.column[3], "display", true);
          this.$set(this.formOption.column[4], "display", true);
          this.$set(this.formOption.column[5], "display", false);
          this.$set(this.formOption.column[7], "span", 24);
        } else {
          this.$set(this.formOption.column[2], "display", false);
          this.$set(this.formOption.column[3], "display", false);
          this.$set(this.formOption.column[4], "display", false);
          this.$set(this.formOption.column[5], "display", true);
          this.$set(this.formOption.column[7], "span", 12);
        }
      },
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
    },
    {
      label: "菜单地址",
      prop: "path",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "图标",
      prop: "icon",
      span: 12,
    },
    {
      label: "是否缓存",
      prop: "keepAlive",
      span: 12,
      type: "select",
      dataType: "number",
      dicData: [
        { label: "缓存", value: 0 },
        { label: "不缓存", value: 1 },
      ],
      rules: [
        {
          required: true,
          message: "请选择页面是否缓存",
          trigger: "change",
        },
      ],
    },
    {
      label: "权限标识",
      prop: "permissions",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "排序",
      prop: "sort",
      type: "number",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "click" }],
    },
    {
      label: "父级ID",
      prop: "parentId",
      type: "tree",
      needMenuData: true,
      dicData: [],
      props: {
        label: "menuName",
        value: "id",
      },
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "click" }],
      value: "-1",
    },
  ],
};
