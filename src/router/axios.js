import qs from "qs";
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { userStore } from "@/store";
import errorCode from "@/config/errorCode.js";
import { serialize } from "@/utils/util";
import {
  addPendingRequest,
  removePendingRequest,
} from "@/router/cancelRepeatRquest";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_PREFIX,
  timeout: 10000,
  withCredentials: true,
  validateStatus(status) {
    return status <= 500;
  },
});

request.interceptors.request.use(
  (config) => {
    const isToken = (config.headers || {}).isToken === false;
    const token = userStore().accessToken;
    if (token && !isToken) {
      config.headers.Authorization = `bearer ${token}`;
    }

    // headers中配置serialize为true开启序列化
    if (config.methods === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    // 处理get 请求的数组 springmvc 可以处理
    if (config.method === "get") {
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }

    addPendingRequest(config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const messageList = [];

request.interceptors.response.use(
  (res) => {
    removePendingRequest(res);
    const status = Number(res.status) || 200;
    const code = res.data?.code;
    const message = res.data?.msg || errorCode[status] || errorCode.default;

    if (code === 101) {
      userStore()
        .fedLogOut()
        .then(() => {
          useRouter().push({ path: "/login" });
        });
    }

    // 错误的请求
    if (status !== 200 || (code && code !== 200)) {
      if (!messageList.includes(message)) {
        messageList.push(message);
        ElMessage({
          message: message,
          type: "error",
          onClose() {
            const index = messageList.findIndex((msg) => msg === message);
            messageList.splice(index, 1);
          },
        });
      }
      return Promise.reject(new Error(message));
    }
    return res;
  },
  (error) => {
    return Promise.reject(new Error(error));
  },
);

export default request;
