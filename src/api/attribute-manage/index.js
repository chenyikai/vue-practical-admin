import request from "@/router/axios.js";

// 获取全部属性列表
export function getPoiTAttributeList(formData) {
  return request.post(`/rest/poiTAttribute/getList`, formData);
}

// 查询poi属性列表
export function getPoiTAttributePage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/poiTAttribute/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增poi属性
export function createPoiTAttribute(formData) {
  return request.post(`/rest/poiTAttribute/add`, formData);
}

// 删除poi类型表-海上
export function deletePoiTAttributeById(id) {
  return request.post(`/rest/poiTAttribute/delete`, { id });
}

// 修改poi属性
export function updatePoiTAttribute(formData) {
  return request.post(`/rest/poiTAttribute/update`, formData);
}

// 获取poi属性详情
export function detailPoiTAttribute(id) {
  return request.post(`/rest/poiTAttribute/getDetail`, { id });
}
