import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface QueryWrapper {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const DICT_BASE_URL = "/rest/sys/dict";
export const DICT_ITEM_BASE_URL = "/rest/sys/dictEntry";

// 分页查询字典
export function getDictPage(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${DICT_BASE_URL}/getPage`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

export function getDictList(): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${DICT_BASE_URL}/getList`,
  });
}

// 新增字典
export function createDict(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${DICT_BASE_URL}/add`, formData);
}

export function dictDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${DICT_BASE_URL}/getDetail`, { id });
}

// 修改字典
export function updateDict(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${DICT_BASE_URL}/update`, formData);
}

// 删除字典
export function deleteDictById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${DICT_BASE_URL}/delete`, { id });
}

// 分页查询字典项
export function getDictItemPage(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${DICT_ITEM_BASE_URL}/getPage`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

// 新增字典项
export function createDictItem(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${DICT_ITEM_BASE_URL}/add`, formData);
}

// 修改字典项
export function updateDictItem(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${DICT_ITEM_BASE_URL}/update`, formData);
}

// 删除字典项
export function deleteDictItemById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${DICT_ITEM_BASE_URL}/delete`, { id });
}

export function dictEntryDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${DICT_ITEM_BASE_URL}/getDetail`, { id });
}

// 获取所有字典
export function getDictAll(): Promise<AxiosResponse> {
  return request.post(`${DICT_BASE_URL}/getAll`);
}
