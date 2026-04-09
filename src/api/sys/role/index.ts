import request from "@/router/axios";
import type { AxiosResponse } from "axios";

export const BASE_URL = "/rest/sys/role";

// 获取角色列表
export function getRoleList(): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getList`);
}

// 新增角色
export function createRole(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改角色
export function updateRole(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/updateRole`, formData);
}

// 根据ID删除角色
export function deleteRoleById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/delete`, { id });
}

export function roleDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getDetail`, { id });
}
