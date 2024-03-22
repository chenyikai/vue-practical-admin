import { defineStore } from "pinia";
import { encryption } from "@/utils/util.js";
import website from "@/config/website.js";
import { userLoginByPassword, getUserInfo } from "@/api/login";
import tabStore from "./tabStore.js";
import { getStore, setStore } from "@/utils/store.js";
import { getDictAll } from "@/api/sys/dict/index.js";

const userStore = defineStore("user", {
  state: () => {
    return {
      expiresIn: getStore({ name: "expiresIn" }) || "",
      accessToken: getStore({ name: "accessToken" }) || "",
      refreshToken: getStore({ name: "refreshToken" }) || "",
      userInfo: getStore({ name: "userInfo" }) || {},
      roles: getStore({ name: "roles" }) || [],
      permissions: getStore({ name: "permissions" }) || [],
      dictAll: getStore({ name: "dictAll" }) || {},
    };
  },
  actions: {
    userLoginByPassword(formData) {
      return new Promise((resolve, reject) => {
        const user = encryption({
          data: formData,
          key: website.iv,
          param: ["password"],
        });
        userLoginByPassword(user)
          .then(({ data }) => {
            this.accessToken = data["access_token"];
            this.refreshToken = data["refresh_token"];
            this.expiresIn = data["expires_in"];
            setStore({ name: "accessToken", content: this.accessToken });
            setStore({ name: "refreshToken", content: this.refreshToken });
            setStore({ name: "expiresIn", content: this.expiresIn });
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    getUserInfo() {
      return new Promise((resolve, reject) => {
        getUserInfo()
          .then((res) => {
            const data = res.data.data || {};
            this.userInfo = data.userInfo;
            this.roles = data.roles || [];
            this.permissions = data.permissions || [];
            setStore({ name: "userInfo", content: this.userInfo });
            setStore({ name: "roles", content: this.roles });
            setStore({ name: "permissions", content: this.permissions });
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    getDictAll() {
      return new Promise((resolve, reject) => {
        getDictAll()
          .then(({ data }) => {
            this.dictAll = data.data;
            setStore({ name: "dictAll", content: data.data });
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    fedLogOut() {
      return new Promise((resolve) => {
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
        // menuStore().deleteAll();
        resolve();
      });
    },
  },
});

export default userStore;
