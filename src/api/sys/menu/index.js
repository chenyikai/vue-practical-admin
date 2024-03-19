import request from "@/router/axios.js";
import { BASE_URL as USER_BASE_URL } from "../user/index.js";

export const BASE_URL = "/rest/sys/menu";

// 获取当前登录用户菜单
export function getUserMenuAll() {
  return request.post(`${USER_BASE_URL}/getMenu`);
}

// 获取所有菜单树
export function getMenuAll() {
  return request.post(`${BASE_URL}/getMenuList`);
}

// 新增菜单
export function createMenu(formData) {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改菜单
export function updateMenu(formData) {
  return request.post(`${BASE_URL}/update`, formData);
}

// 删除菜单
export function deleteMenuById(id) {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 根据角色ID获取菜单
export function getRoleMenuById(roleId) {
  return request.get(`${BASE_URL}/getMenuListByRoleId/${roleId}`);
}
