import { getDictData } from "@/utils/util.js";

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
  calcHeight: 30,
  column: [
    {
      label: "用户名",
      prop: "username",
    },
    {
      label: "姓名",
      prop: "name",
    },
    {
      label: "性别",
      prop: "gender",
      type: "select",
      dataType: "number",
      dicData: getDictData("gender"),
    },
    {
      label: "联系方式",
      prop: "mobile",
    },
    {
      label: "状态",
      prop: "status",
      dataType: "number",
      dicData: getDictData("user_status"),
    },
    {
      label: "操作",
      prop: "menu",
      slot: true,
      width: 250,
    },
  ],
};

export const formOption = {
  menuBtn: false,
  labelWidth: 120,
  labelPosition: "right",
  column: [
    {
      label: "用户名",
      prop: "username",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "姓名",
      prop: "name",
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "性别",
      prop: "gender",
      type: "select",
      span: 12,
      dataType: "number",
      dicData: getDictData("gender"),
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
    },
    {
      label: "所属部门",
      prop: "deptId",
      type: "tree",
      multiple: false,
      dicMethod: "post",
      dicUrl: "/rest/sys/dept/getDeptTree",
      props: {
        label: "deptName",
        value: "id",
      },
      span: 12,
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
    },
    {
      label: "是否数据权限",
      prop: "isAdmin",
      type: "select",
      rules: [{ required: true, message: "不能为空", trigger: "change" }],
      dicData: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
    },
    {
      label: "邮箱",
      prop: "email",
      span: 12,
    },
    {
      label: "联系电话",
      prop: "mobile",
      span: 12,
    },
    {
      label: "状态",
      prop: "status",
      type: "select",
      dataType: "number",
      dicData: getDictData("user_status"),
      span: 12,
      rules: [{ required: true, message: "请选择状态", trigger: "change" }],
    },
    // {
    //   label: "头像",
    //   prop: "avatar",
    //   type: "upload",
    //   action: "",
    // },
    {
      label: "用户角色",
      prop: "roleList",
      type: "select",
      multiple: true,
      dicMethod: "post",
      dicUrl: "/rest/sys/role/getList",
      span: 24,
      props: {
        label: "roleName",
        value: "id",
      },
      rules: [{ required: true, message: "请选择用户角色", trigger: "change" }],
    },
    {
      label: "描述",
      prop: "description",
      type: "textarea",
      span: 24,
    },
  ],
};
