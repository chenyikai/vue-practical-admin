import { getDictData } from "@/utils/util.js";
import { validatenull } from "@/utils/validate.js";

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
      label: "船队名称",
      prop: "teamName",
      width: 220,
    },
    {
      label: "船舶名称",
      prop: "shipName",
    },
    {
      label: "类型",
      prop: "type",
      type: "select",
      dataType: "string",
      dicData: getDictData("vessel_type"),
      width: 140,
    },
    {
      label: "MMSI",
      prop: "mmsi",
      width: 140,
    },
    // {
    //   label: "建造时间",
    //   prop: "builtDate",
    //   width: 140,
    // },

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
      label: "操作",
      prop: "menu",
      fixed: "right",
      width: 200,
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
      prop: "teamId",
      slot: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "类型",
      prop: "type",
      dataType: "string",
      type: "select",
      dicData: getDictData("vessel_type"),
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "船舶名称",
      prop: "shipName",
      slot: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    {
      label: "MMSI",
      prop: "mmsi",
      disabled: true,
      rules: [{ required: true, message: "不能为空", trigger: "blur" }],
    },
    // {
    //   label: "建造时间",
    //   prop: "builtDate",
    //   type: "datetime",
    //   valueFormat: "yyyy-MM-dd HH:mm:ss",
    // format: "yyyy-MM-dd",
    // },

    {
      label: "负责人",
      prop: "headPeople",
    },
    {
      label: "联系方式",
      prop: "tel",
      rules: [
        {
          trigger: "blur",
          validator: isvalidatemobile,
        },
      ],
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
