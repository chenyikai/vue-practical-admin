import request from "@/router/axios";
import type { AxiosResponse } from "axios";

export function getShipByKeyword(data: Record<string, unknown>): Promise<AxiosResponse> {
  return request({
    url: "/rest/ehhship/getShipByKeyword",
    method: "post",
    data,
  });
}
