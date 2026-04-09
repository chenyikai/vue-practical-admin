import request from "@/router/axios";
import type { AxiosResponse } from "axios";

interface LoginForm {
  username: string;
  password: string;
  key?: string;
  code?: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

/**
 * 密码登录
 * 注意：Basic Auth 中的 client_id:secret 在 SPA 中是公开可见的，
 * 这是 OAuth2 Public Client 的已知限制，后续应迁移为 BFF 模式。
 * 凭证已移至环境变量，避免硬编码在源码中。
 */
export function userLoginByPassword(formData: LoginForm): Promise<AxiosResponse<TokenResponse>> {
  return request({
    url: "/rest/auth/token",
    method: "post",
    headers: {
      isToken: false,
      Authorization: `Basic ${import.meta.env.VITE_CLIENT_CREDENTIALS}`,
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

export function refreshToken(token: string): Promise<AxiosResponse<TokenResponse>> {
  return request({
    url: "/rest/auth/token",
    method: "post",
    headers: {
      isToken: false,
      Authorization: `Basic ${import.meta.env.VITE_CLIENT_CREDENTIALS}`,
    },
    params: {
      refresh_token: token,
      grant_type: "refresh_token",
    },
  });
}

export function getUserInfo(): Promise<AxiosResponse> {
  return request.post("/rest/auth/user");
}
