import request from "@/router/axios.js";

export function userLoginByPassword(formData) {
  return request({
    url: "/rest/auth/token",
    method: "post",
    headers: {
      isToken: false,
      Authorization: `Basic ${btoa("aochen_web:123456")}`,
    },
    params: {
      key: formData.key,
      code: formData.code,
      password: btoa(formData.password),
      username: formData.username,
      grant_type: "password",
    },
  });
}

export function refreshToken(refreshToken) {
  return request({
    url: "/rest/auth/token",
    method: "post",
    headers: {
      isToken: false,
      Authorization: `Basic ${btoa("aochen_web:123456")}`,
    },
    params: {
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    },
  });
}

export function getUserInfo() {
  return request.post("/rest/auth/user");
}
