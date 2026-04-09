import { defineStore } from "pinia";
import { encryptAES_CBC } from "@/utils/util";
import { userLoginByPassword, getUserInfo } from "@/api/login";
import tabStore from "./tabStore";
import { getStore, setStore } from "@/utils/store";
import { getDictAll } from "@/api/sys/dict/index";

type UserInfo = Record<string, unknown>;

interface LoginTokenData {
  access_token: string;
  refresh_token: string;
  expires_in: string;
}

interface UserInfoData {
  userInfo: UserInfo;
  roles: string[];
  permissions: string[];
}

interface LoginForm {
  username: string;
  password: string;
  key?: string;
  code?: string;
}

const userStore = defineStore("user", {
  state: () => ({
    expiresIn: (getStore({ name: "expiresIn" }) as string | undefined) ?? "",
    accessToken: (getStore({ name: "accessToken" }) as string | undefined) ?? "",
    refreshToken: (getStore({ name: "refreshToken" }) as string | undefined) ?? "",
    userInfo: (getStore({ name: "userInfo" }) as UserInfo | undefined) ?? {},
    roles: (getStore({ name: "roles" }) as string[] | undefined) ?? [],
    permissions: (getStore({ name: "permissions" }) as string[] | undefined) ?? [],
    dictAll: (getStore({ name: "dictAll" }) as Record<string, unknown[]> | undefined) ?? {},
  }),
  actions: {
    async userLoginByPassword(formData: LoginForm): Promise<void> {
      const user = { ...formData, password: encryptAES_CBC(formData.password) };
      const { data } = await userLoginByPassword(user);
      const tokenData = data as LoginTokenData;
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.expiresIn = tokenData.expires_in;
      setStore({ name: "accessToken", content: this.accessToken });
      setStore({ name: "refreshToken", content: this.refreshToken });
      setStore({ name: "expiresIn", content: this.expiresIn });
    },
    async getUserInfo(): Promise<UserInfoData> {
      const res = await getUserInfo();
      const resData = res.data as Record<string, unknown>;
      const data = (resData["data"] as UserInfoData | undefined) ?? ({} as UserInfoData);
      this.userInfo = data.userInfo;
      this.roles = data.roles;
      this.permissions = data.permissions;
      setStore({ name: "userInfo", content: this.userInfo });
      setStore({ name: "roles", content: this.roles });
      setStore({ name: "permissions", content: this.permissions });
      return data;
    },
    async getDictAll(): Promise<void> {
      const res = await getDictAll();
      const dictData = (res.data as Record<string, unknown>)["data"] as Record<string, unknown[]>;
      this.dictAll = dictData;
      setStore({ name: "dictAll", content: this.dictAll });
    },
    fedLogOut(): Promise<void> {
      this.userInfo = {};
      this.accessToken = "";
      this.refreshToken = "";
      this.expiresIn = "";
      this.roles = [];
      this.permissions = [];
      setStore({ name: "accessToken", content: "" });
      setStore({ name: "refreshToken", content: "" });
      setStore({ name: "expiresIn", content: "" });
      setStore({ name: "userInfo", content: {} });
      setStore({ name: "roles", content: [] });
      setStore({ name: "permissions", content: [] });
      tabStore().deleteAll();
      return Promise.resolve();
    },
  },
});

export default userStore;
