import request from "@/router/axios.js";

export function getShipPoiByMmsi(mmsi) {
  return request({
    url: "/rest/ehhship/getShipPoiByMmsi",
    method: "post",
    data: { mmsi },
  });
}

export function getGreenDot(data) {
  return request({
    url: "/rest/ehhship/getGreenPoiByRange",
    method: "post",
    data,
  });
}

export function getInternalShip() {
  return request({
    url: "/rest/shipInfo/getNbShipDataListNew",
    method: "post",
    data: {},
  });
}

export function getExternalShip(data) {
  return request({
    url: "/rest/ehhship/getShipDataList",
    method: "post",
    data,
  });
}

export function getShipIcon() {
  return request({
    url: "/rest/shipTeam/getShipTeamList",
    method: "post",
    data: {},
  });
}
