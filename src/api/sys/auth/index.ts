import request from "@/router/axios";
import type { AxiosResponse } from "axios";

export const BASE_URL = "/rest/auth";

// 修改当前用户密码
export function resetPassword(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/changePassword`, formData);
}

// 修改当前用户信息
export function setInfoUserData(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/updateUser`, formData);
}
