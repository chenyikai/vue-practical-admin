import request from "@/router/axios";
import { BASE_URL as USER_BASE_URL } from "../user/index";
import type { AxiosResponse } from "axios";

export const BASE_URL = "/rest/sys/menu";

// 获取当前登录用户菜单
export function getUserMenuAll(): Promise<AxiosResponse> {
  return request.post(`${USER_BASE_URL}/getMenu`);
}

// 获取所有菜单树
export function getMenuAll(): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getTree`);
}

// 新增菜单
export function createMenu(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改菜单
export function updateMenu(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/update`, formData);
}

// 删除菜单
export function deleteMenuById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 根据角色ID获取菜单
export function getRoleMenuById(roleId: string | number): Promise<AxiosResponse> {
  return request.get(`${BASE_URL}/getMenuListByRoleId/${String(roleId)}`);
}

export function menuDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getDetail`, { id });
}
