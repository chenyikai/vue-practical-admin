import request from "@/router/axios.js";

// 查询poi类型表-海上列表
export function getPoiTTypePage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/poiTType/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 查询全部poi类型表-海上列表
export function getPoiTTypeAllType(formData) {
  return request.post(`/rest/poiTType/getAllType`, formData);
}

// 新增poi类型表-海上
export function createPoiTType(formData) {
  return request.post(`/rest/poiTType/add`, formData);
}

// 删除poi类型表-海上
export function deletePoiTTypeById(id) {
  return request.post(`/rest/poiTType/delete`, { id });
}

// 修改poi类型表-海上
export function updatePoiTType(formData) {
  return request.post(`/rest/poiTType/update`, formData);
}

// 获取poi类型表-海上详情
export function detailPoiTType(id) {
  return request.post(`/rest/poiTType/getDetail`, { id });
}

// 查询poi类型表-岸基列表
export function getPoiTTypeShorePage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/poiTTypeShore/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 查询全部poi类型表-岸基列表
export function getPoiTTypeShoreAllType(formData) {
  return request.post(`/rest/poiTTypeShore/getAllTypeShore`, formData);
}

// 新增poi类型表-岸基
export function createPoiTTypeShore(formData) {
  return request.post(`/rest/poiTTypeShore/add`, formData);
}

// 删除poi类型表-岸基
export function deletePoiTTypeShore(id) {
  return request.post(`/rest/poiTTypeShore/delete`, { id });
}

// 修改poi类型表-岸基
export function updatePoiTTypeShore(formData) {
  return request.post(`/rest/poiTTypeShore/update`, formData);
}

// 获取poi类型表-岸基详情
export function detailPoiTTypeShore(id) {
  return request.post(`/rest/poiTTypeShore/getDetail`, { id });
}
