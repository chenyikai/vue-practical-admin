import qs from "qs";
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router/index";
import { userStore } from "@/store";
import errorCode from "@/config/errorCode";
import { serialize } from "@/utils/util";
import { addPendingRequest, removePendingRequest } from "@/router/cancelRepeatRquest";

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
    const isToken = config.headers["isToken"] === false;
    const token = userStore().accessToken;
    if (token && !isToken) {
      config.headers.Authorization = `bearer ${token}`;
    }

    // FIX: 原代码 config.methods（拼写错误）改为 config.method
    if (config.method === "post" && config.headers["serialize"]) {
      config.data = serialize(config.data as Record<string, unknown>);
      delete (config.data as Record<string, unknown>)["serialize"];
    }

    if (config.method === "get") {
      config.paramsSerializer = (params: Record<string, unknown>) =>
        qs.stringify(params, { arrayFormat: "repeat" });
    }

    addPendingRequest(config);
    return config;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

// FIX: 使用 Set 替代无上限数组，防止内存泄漏
const messageSet = new Set<string>();

request.interceptors.response.use(
  (res) => {
    removePendingRequest(res);
    const status = res.status || 200;
    const data = res.data as Record<string, unknown>;
    const code = data["code"] as number | undefined;
    const message =
      (data["msg"] as string | undefined) ??
      errorCode[status] ??
      errorCode["default"] ??
      "未知错误";

    if (code === 101) {
      void userStore()
        .fedLogOut()
        .then(() => router.push({ path: "/login" }));
    }

    if (status !== 200 || (code !== undefined && code !== 200)) {
      if (!messageSet.has(message)) {
        messageSet.add(message);
        // Element Plus 2.9.x 内部 EpPropFinalized 类型与公开 API 不兼容，通过 unknown 转换绕过
        (
          ElMessage as unknown as (o: {
            message: string;
            type: string;
            onClose: () => void;
          }) => void
        )({
          message,
          type: "error",
          onClose: () => {
            messageSet.delete(message);
          },
        });
      }
      return Promise.reject(new Error(message));
    }

    return res;
  },
  (error: unknown) => Promise.reject(error instanceof Error ? error : new Error(String(error))),
);

export default request;
