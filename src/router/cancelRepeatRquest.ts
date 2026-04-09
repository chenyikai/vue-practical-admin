import type { AxiosRequestConfig, AxiosResponse } from "axios";
import Axios from "axios";

const pendingRequest = new Map<string, (key: string) => void>();

export function addPendingRequest(config: AxiosRequestConfig): void {
  if (!config.headers?.["cancelRequest"]) {
    return;
  }
  const requestKey = generateReqKey(config);
  // 取消已有的同名请求
  const existingCancel = pendingRequest.get(requestKey);
  if (existingCancel !== undefined) {
    existingCancel(requestKey);
  }
  config.cancelToken = new Axios.CancelToken((cancel) => {
    pendingRequest.set(requestKey, cancel);
  });
}

export function removePendingRequest(response: AxiosResponse): void {
  if (!response.config.headers["cancelRequest"]) {
    return;
  }
  const requestKey = generateReqKey(response.config);
  if (pendingRequest.has(requestKey)) {
    const cancel = pendingRequest.get(requestKey);
    if (cancel !== undefined) {
      cancel(requestKey);
    }
    pendingRequest.delete(requestKey);
  }
}

function generateReqKey(config: AxiosRequestConfig): string {
  if (config.data !== undefined && isJsonStr(config.data as string)) {
    config.data = JSON.parse(config.data as string) as unknown;
  }
  return [config.method, config.url].join("&");
}

/**
 * FIX: 原代码在 catch 中 throw new Error(e)，会中断请求拦截器流程
 * 改为解析失败时返回 false
 */
function isJsonStr(str: unknown): boolean {
  if (typeof str !== "string") {
    return false;
  }
  try {
    const obj: unknown = JSON.parse(str);
    return typeof obj === "object" && obj !== null;
  } catch {
    return false;
  }
}
