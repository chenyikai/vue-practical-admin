import request from "@/router/axios.js";

export const DICT_BASE_URL = "/rest/sys/dict";
export const DICT_ITEM_BASE_URL = "/rest/sys/dictEntry";

// 分页查询字典
export function getDictPage(queryWrapper) {
  return request({
    method: "post",
    url: `${DICT_BASE_URL}/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增字典
export function createDict(formData) {
  return request.post(`${DICT_BASE_URL}/add`, formData);
}

export function dictDetail(id) {
  return request.post(`${DICT_BASE_URL}/getDetail`, { id });
}

// 修改字典
export function updateDict(formData) {
  return request.post(`${DICT_BASE_URL}/update`, formData);
}

// 删除字典
export function deleteDictById(id) {
  return request.post(`${DICT_BASE_URL}/delete`, { id });
}

// 分页查询字典项
export function getDictItemPage(queryWrapper) {
  return request({
    method: "post",
    url: `${DICT_ITEM_BASE_URL}/getPage`,
    data: queryWrapper.data,
    params: queryWrapper.params,
  });
}

// 新增字典项
export function createDictItem(formData) {
  return request.post(`${DICT_ITEM_BASE_URL}/add`, formData);
}

// 修改字典项
export function updateDictItem(formData) {
  return request.post(`${DICT_ITEM_BASE_URL}/update`, formData);
}

// 删除字典项
export function deleteDictItemById(id) {
  return request.post(`${DICT_ITEM_BASE_URL}/delete`, { id });
}

export function dictEntryDetail(id) {
  return request.post(`${DICT_ITEM_BASE_URL}/getDetail`, { id });
}

// 获取所有字典
export function getDictAll() {
  return request.post(`${DICT_BASE_URL}/getAll`);
}
