import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface QueryWrapper {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const BASE_URL = "/rest/sys/user";

// 分页获取用户数据
export function getUserPage(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

// 删除用户
export function deleteUserById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 新增用户
export function createUser(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改用户
export function updateUser(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/update`, formData);
}

// 重置密码
export function resetPwd(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/resetPwd`, formData);
}

export function userDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getDetail`, { id });
}

// 获取当前登录用户菜单
export function getUserMenuAll(): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getMenu`);
}
