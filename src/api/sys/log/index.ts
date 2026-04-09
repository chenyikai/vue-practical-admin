import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface QueryWrapper {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const BASE_URL = "/rest/sys/log";

// 分页获取日志数据
export function getLogPage(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

export function logDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getDetail`, { id });
}
