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
      label: "用户名称",
      prop: "username",
    },
    {
      label: "是否为当前登录用户",
      prop: "current",
    },
    {
      label: "用户主机地址",
      prop: "host",
    },
    {
      label: "用户登录ip",
      prop: "ip",
    },
    {
      label: "所在地",
      prop: "location",
    },
    {
      label: "最后访问时间",
      prop: "lastAccessTime",
    },
    {
      label: "登录时间",
      prop: "loginTime",
    },
    {
      label: "超时时间",
      prop: "timeout",
    },
    {
      label: "状态",
      prop: "status",
      dicData: getDictData("status"),
    },
    {
      label: "操作",
      prop: "menu",
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
      label: "用户名称",
      prop: "username",
    },
    {
      label: "是否为当前登录用户",
      prop: "current",
    },
    {
      label: "用户主机地址",
      prop: "host",
    },
    {
      label: "用户登录ip",
      prop: "ip",
    },
    {
      label: "所在地",
      prop: "location",
    },
    {
      label: "最后访问时间",
      prop: "lastAccessTime",
    },
    {
      label: "登录时间",
      prop: "loginTime",
    },
    {
      label: "超时时间",
      prop: "timeout",
    },
    {
      label: "状态",
      prop: "status",
      dicData: getDictData("status"),
    },
  ],
};
