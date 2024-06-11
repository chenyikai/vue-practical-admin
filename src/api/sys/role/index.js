import request from "@/router/axios.js";

export const BASE_URL = "/rest/sys/role";

// 获取角色列表
export function getRoleList() {
  return request.post(`${BASE_URL}/getList`);
}

// 新增角色
export function createRole(formData) {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改角色
export function updateRoleLitmit(formData) {
  return request.post(`${BASE_URL}/updateRole`, formData);
}

export function updateRole(formData) {
  return request.post(`${BASE_URL}/update`, formData);
}

// 根据ID删除角色
export function deleteRoleById(id) {
  return request.post(`${BASE_URL}/delete`, { id });
}

export function roleDetail(id) {
  return request.post(`${BASE_URL}/getDetail`, { id });
}
