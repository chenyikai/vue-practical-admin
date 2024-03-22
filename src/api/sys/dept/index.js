import request from "@/router/axios.js";

export const BASE_URL = "/rest/sys/dept";

// 分页获取部门机构数据
export function getDeptPage(queryWrapper) {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 删除部门机构
export function deleteDeptById(id) {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 新增部门机构
export function createDept(formData) {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改部门机构
export function updateDept(formData) {
  return request.post(`${BASE_URL}/update`, formData);
}

export function deptDetail(id) {
  return request.post(`${BASE_URL}/getDetail`, { id });
}

// 获取所有部门树
export function getDeptTree(queryWrapper = {}) {
  return request({
    method: "post",
    url: `${BASE_URL}/getDeptTree`,
    data: queryWrapper.data || {},
    params: queryWrapper.params || {},
  });
}

// 获取父级下的部门列表
export function getDeptList() {
  return request.post(`${BASE_URL}/getAllDeptList`);
}
