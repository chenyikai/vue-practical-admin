import request from "@/router/axios.js";

export function reqGetShipTeamPage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/shipTeam/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增船队
export function reqAddShipTeam(data) {
  return request({
    url: "/rest/shipTeam/add",
    method: "post",
    data,
  });
}

// 获取船队详情
export function reqGetShipTeamDetail(id) {
  return request({
    url: "/rest/shipTeam/getDetail",
    method: "post",
    data: { id },
  });
}

// 修改船队
export function reqUpdateShipTeam(data) {
  return request({
    url: "/rest/shipTeam/update",
    method: "post",
    data,
  });
}
// 删除船队
export function reqDeleteShipTeam(id) {
  return request({
    url: "/rest/shipTeam/delete",
    method: "post",
    data: { id },
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
