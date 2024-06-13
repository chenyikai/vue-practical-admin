import { getDictData } from "@/utils/util.js";
import { validatenull } from "@/utils/validate.js";

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
      label: "船队名称",
      prop: "name",
      width: 250,
    },
    {
      label: "船队颜色",
      prop: "color",
      width: 140,
      slot: true,
    },
    {
      label: "负责人",
      prop: "headPeople",
      width: 150,
    },
    {
      label: "联系方式",
      prop: "tel",
      width: 220,
    },
    {
      label: "备注",
      prop: "remark",
    },
    {
      label: "操作",
      prop: "menu",
      fixed: "right",
      width: 150,
      slot: true,
    },
  ],
};

export const formOption = {
  menuBtn: false,
  labelWidth: 100,
  labelPosition: "right",
  column: [
    {
      label: "部门",
      prop: "deptId",
      slot: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "船队名称",
      prop: "name",
      maxlength: 100,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "颜色设置",
      prop: "color",
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      slot: true,
      span: 24,
    },
    {
      label: "负责人",
      prop: "headPeople",
      span: 12,
      maxlength: 50,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "联系方式",
      prop: "tel",
      span: 12,
      maxlength: 50,
      rules: [
        {
          required: true,
          trigger: "blur",
          validator: isvalidatemobile,
        },
      ],
    },
    {
      label: "备注",
      prop: "remark",
      span: 24,
      type: "textarea",
      minRows: 5,
      maxlength: 255,
      showWordLimit: true,
    },
  ],
};
function isvalidatemobile(rule, phone, callback) {
  let result = true;
  let msg = "";
  const isPhone = /^(1\d{10})$/;
  if (!validatenull(phone)) {
    if (String(phone).length === 11) {
      if (!isPhone.test(phone)) {
        result = true;
        msg = "手机号码格式不正确";
      } else {
        result = false;
      }
    } else {
      result = true;
      msg = "手机号码长度不为11位";
    }
  } else {
    result = true;
    msg = "手机号码不能为空";
  }
  if (result) {
    callback(msg);
  } else {
    callback();
  }
}
