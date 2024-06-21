import request from "@/router/axios.js";

//----------------------海上数据-----------------------
// 查询poi信息表-海上列表
export function getPoiTInfoPage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/poiTInfo/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增poi信息表-海上
export function createPoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/add`, formData);
}

// 删除poi信息表-海上
export function deletePoiTInfoById(id) {
  return request.post(`/rest/poiTInfo/delete`, { id });
}

// 修改poi信息表-海上
export function updatePoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/update`, formData);
}

// 获取poi信息表-海上详情
export function detailPoiTInfo(id) {
  return request.post(`/rest/poiTInfo/getDetail`, { id });
}

// 批量删除参数id数组-海上
export function batchDeletePoiTInfo(ids) {
  return request.post(`/rest/poiTInfo/batchDelete`, ids);
}

// 超管批量发布参数id数组-海上
export function restPublishPoiTInfo(ids) {
  return request.post(`/rest/poiTInfo/publish`, ids);
}

// poi信息表-海上-新增反馈
export function addFeedbackPoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/addFeedback`, formData);
}

// poi信息表-海上-修改反馈
export function updateFeedbackPoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/updateFeedback`, formData);
}

// 获取poi信息表-海上-反馈详情
export function detailFeedbackPoiTInfo(id) {
  return request.post(`/rest/poiTInfoFeedback/getDetail`, { id });
}

// poi信息表-海上-审核
export function auditFeedbackPoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/auditFeedback`, formData);
}

// 发布poi-海上
export function publishPoiTInfo(idList) {
  return request.post(`/rest/poiTInfo/publish`, idList);
}

// 提交同步数据单条-海上
export function syncDataOnePoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/syncDataOne`, formData);
}

// 审核同步的数据-海上
export function auditSyncDataPoiTInfo(formData) {
  return request.post(`/rest/poiTInfo/auditSyncData`, formData);
}

// 下载poi模版-海上
export function downloadTemplatePoiTInfo(formData) {
  return request({
    method: "post",
    url: "/rest/poiTInfo/downloadTemplate",
    data: formData,
    responseType: "blob",
  });
}

// 导出海上poi数据-海上
export function exportDataPoiTInfo(formData) {
  return request({
    method: "post",
    url: "/rest/poiTInfo/exportData",
    data: formData,
    responseType: "blob",
  });
}

// 导入poi-海上
export function importDataPoiTInfo(data, onProgress) {
  return request({
    method: "post",
    url: "/rest/poiTInfo/importData",
    data,
    timeout: 0,
    onUploadProgress: onProgress,
  });
}

//----------------------岸基数据-----------------------
// 查询poi信息表-岸基列表
export function getPoiTInfoShorePage(queryWrapper) {
  return request({
    method: "post",
    url: `/rest/poiTInfoShore/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增poi信息表-岸基
export function createPoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/add`, formData);
}

// 删除poi信息表-岸基
export function deletePoiTInfoShoreById(id) {
  return request.post(`/rest/poiTInfoShore/delete`, { id });
}

// 修改poi信息表-岸基
export function updatePoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/update`, formData);
}

// 获取poi信息表-岸基详情
export function detailPoiTInfoShore(id) {
  return request.post(`/rest/poiTInfoShore/getDetail`, { id });
}

// 批量删除参数id数组-岸基
export function batchDeletePoiTInfoShore(ids) {
  return request.post(`/rest/poiTInfoShore/batchDelete`, ids);
}

// 超管批量发布参数id数组-海上
export function restPublishPoiTInfoShore(ids) {
  return request.post(`/rest/poiTInfoShore/publish`, ids);
}

// poi信息表-岸基-新增反馈
export function addFeedbackPoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/addShoreFeedback`, formData);
}

// poi信息表-岸基-修改反馈
export function updateFeedbackPoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/updateShoreFeedback`, formData);
}

// 获取poi信息表-岸基-反馈详情
export function detailFeedbackPoiTInfoShore(id) {
  return request.post(`/rest/poiTInfoShoreFeedback/getDetail`, { id });
}

// poi信息表-岸基-审核
export function auditShoreFeedbackPoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/auditShoreFeedback`, formData);
}

// 发布poi-岸基
export function publishPoiTInfoShore(idList) {
  return request.post(`/rest/poiTInfoShore/publish`, idList);
}

// 提交同步数据单条-岸基
export function syncDataOnePoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/syncDataOne`, formData);
}

// 审核同步的数据-岸基
export function auditSyncDataPoiTInfoShore(formData) {
  return request.post(`/rest/poiTInfoShore/auditSyncData`, formData);
}

// 下载poi模版-岸基
export function downloadTemplatePoiTInfoShore(formData) {
  return request({
    method: "post",
    url: "/rest/poiTInfoShore/downloadTemplate",
    data: formData,
    responseType: "blob",
  });
}

// 导出岸基poi数据-岸基
export function exportDataPoiTInfoShore(formData) {
  return request({
    method: "post",
    url: "/rest/poiTInfoShore/exportData",
    data: formData,
    responseType: "blob",
  });
}

// 导入poi-岸基
export function importDataPoiTInfoShore(data, onProgress) {
  return request({
    method: "post",
    url: "/rest/poiTInfoShore/importData",
    data,
    timeout: 0,
    onUploadProgress: onProgress,
  });
}
