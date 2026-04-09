import request from "@/router/axios";
import type { AxiosResponse } from "axios";

export function getShipPoiByMmsi(mmsi: string | number): Promise<AxiosResponse> {
  return request({
    url: "/rest/ehhship/getShipPoiByMmsi",
    method: "post",
    data: { mmsi },
  });
}

export function getGreenDot(data: Record<string, unknown>): Promise<AxiosResponse> {
  return request({
    url: "/rest/ehhship/getGreenPoiByRange",
    method: "post",
    data,
  });
}

export function getInternalShip(): Promise<AxiosResponse> {
  return request({
    url: "/rest/shipInfo/getNbShipDataListNew",
    method: "post",
    data: {},
  });
}

export function getExternalShip(data: Record<string, unknown>): Promise<AxiosResponse> {
  return request({
    url: "/rest/ehhship/getShipDataList",
    method: "post",
    data,
  });
}

export function getShipIcon(): Promise<AxiosResponse> {
  return request({
    url: "/rest/shipTeam/getShipTeamList",
    method: "post",
    data: {},
  });
}
