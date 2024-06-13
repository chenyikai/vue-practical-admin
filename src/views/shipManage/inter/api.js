import request from "@/router/axios.js";

// 查询内部船舶列表
export function getInnerShipPage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/shipInfo/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增内部船舶
export function createInnerShip(formData) {
  return request.post(`/rest/shipInfo/add`, formData);
}

// 删除poi类型表-海上
export function deleteInnerShipById(id) {
  return request.post(`/rest/shipInfo/delete`, { id });
}

// 修改内部船舶
export function updateInnerShip(formData) {
  return request.post(`/rest/shipInfo/update`, formData);
}

// 获取内部船舶详情
export function detailInnerShip(id) {
  return request.post(`/rest/shipInfo/getDetail`, { id });
}

// 获取部门下船队
export function getShipTeamByDept(data) {
  return request({
    url: "/rest/shipTeam/getShipTeamByDept",
    method: "post",
    data,
  });
}

// 获取所有部门树
export function getDeptTree(queryWrapper = {}) {
  return request({
    method: "post",
    url: `/rest/sys/dept/getDeptTree`,
    data: queryWrapper.data || {},
    params: queryWrapper.params || {},
  });
}

export function getShipByKeyword(data) {
  return request({
    url: "/rest/ehhship/getShipByKeyword",
    method: "post",
    data,
  });
}
