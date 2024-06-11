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
    calcHeight: 30,
    column: [
        {
            label: "接口名称",
            prop: "name",
        },
        {
            label: "接口前缀",
            prop: "host",
        },
        {
            label: "接口地址",
            prop: "url",
        },
        {
            label: "请求类型",
            prop: "method",
            dicData: getDictData("request_method"),
            dataType: "string",
            width: 100,
        },
        {
            label: "数据类型",
            prop: "type",
            dicData: getDictData("api_type"),
            dataType: "string",
            width: 100,
        },

        {
            label: "描述",
            prop: "remark",
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
            label: "接口名称",
            prop: "name",
            span: 24,
            rules: [
                {
                    required: true,
                    message: "请输入接口名称",
                    trigger: "blur",
                },
            ],
        },
        {
            label: "接口前缀",
            prop: "host",
            span: 24,
            rules: [
                {
                    required: true,
                    message: "请输入接口前缀",
                    trigger: "blur",
                },
                {
                    validator: (rule, value, callback) => {
                        if (/[^\u0000-\u00FF]/.test(value)) {
                            callback(new Error("接口前缀不能包含中文字符"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur",
                },
            ],
        },
        {
            label: "接口地址",
            prop: "url",
            span: 24,
            rules: [
                {
                    required: true,
                    message: "请输入接口地址",
                    trigger: "blur",
                },
                {
                    validator: (rule, value, callback) => {
                        if (/[^\u0000-\u00FF]/.test(value)) {
                            callback(new Error("接口地址不能包含中文字符"));
                        } else {
                            callback();
                        }
                    },
                    trigger: "blur",
                },
            ],
        },
        {
            label: "请求类型",
            prop: "method",
            type: "select",
            dicData: getDictData("request_method"),
            dataType: "string",
            rules: [
                {
                    required: true,
                    message: "请选择请求类型",
                    trigger: "blur",
                },
            ],
        },
        {
            label: "数据类型",
            prop: "type",
            dicData: getDictData("api_type"),
            dataType: "string",
            type: "select",
            rules: [
                {
                    required: true,
                    message: "请选择数据类型",
                    trigger: "blur",
                },
            ],
        },
        {
            label: "描述",
            prop: "remark",
            type: "textarea",
            span: 24,
        },
    ],
};
