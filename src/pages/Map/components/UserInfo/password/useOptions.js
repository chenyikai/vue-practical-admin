import { reactive } from "vue";
import { validPassword } from "@/utils/validate.js";

export default () => {
  const formOption = reactive({
    menuBtn: false,
    labelWidth: 100,
    labelPosition: "right",
    column: [
      {
        label: "原密码",
        prop: "oldPassword",
        type: "password",
        span: 24,
        rules: [{ required: true, message: "不能为空", trigger: "blur" }],
      },
      {
        label: "新密码",
        prop: "newPassword",
        type: "password",
        span: 24,
        rules: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            validator(rule, value, callback) {
              const flag = validPassword(value);
              if (value.length < 8 || value.length > 15) {
                callback(new Error("密码必须在8-15位之间"));
              } else if (!flag) {
                callback(new Error("密码必须包含大写+小写+数字"));
              } else {
                callback();
              }
            },
          },
        ],
      },
      {
        label: "确认密码",
        prop: "newPassword1",
        type: "password",
        span: 24,
      },
    ],
  });

  function setRule(prop, value) {
    const index = formOption.column.findIndex((item) => item.prop === prop);
    if (index === -1) {
      console.warn("未找到该配置");
      return;
    }

    formOption.column[index]["rules"] = value;
  }

  return {
    formOption,
    setRule,
  };
};
