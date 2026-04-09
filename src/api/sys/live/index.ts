import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface QueryWrapper {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const BASE_URL = "/rest/sys/session";

// 踢除用户
export function kickoutLiveData(id: string | number): Promise<AxiosResponse> {
  return request.get(`${BASE_URL}/kickout/${String(id)}`);
}

// 查询在线用户会话列表
export function getLiveList(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${BASE_URL}/getList`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}
