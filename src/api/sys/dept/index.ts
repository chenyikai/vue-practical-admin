import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface QueryWrapper {
  data?: Record<string, unknown>;
  params?: Record<string, unknown>;
}

export const BASE_URL = "/rest/sys/org";

// 分页获取部门机构数据
export function getDeptPage(queryWrapper: QueryWrapper): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${BASE_URL}/getPage`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

// 删除部门机构
export function deleteDeptById(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/delete`, { id });
}

// 新增部门机构
export function createDept(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/add`, formData);
}

// 修改部门机构
export function updateDept(formData: Record<string, unknown>): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/update`, formData);
}

export function deptDetail(id: string | number): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getDetail`, { id });
}

// 获取所有部门树
export function getDeptTree(queryWrapper: QueryWrapper = {}): Promise<AxiosResponse> {
  return request({
    method: "post",
    url: `${BASE_URL}/getDeptTree`,
    data: queryWrapper.data ?? {},
    params: queryWrapper.params ?? {},
  });
}

// 获取父级下的部门列表
export function getDeptList(): Promise<AxiosResponse> {
  return request.post(`${BASE_URL}/getAllDeptList`);
}
