import { defineStore } from "pinia";
import { encryption } from "@/utils/util.js";
import website from "@/config/website.js";
import { userLoginByPassword } from "@/api/login";

const userStore = defineStore("user", {
  state: () => {
    return {
      expiresIn: "",
      accessToken: "",
      refreshToken: "",
      userInfo: {},
      roles: [],
      permissions: [],
      menuAll: [],
      dictAll: {},
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
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    fedLogOut() {
      return new Promise((resolve) => {
        this.userInfo = {};
        this.accessToken = "";
        this.refreshToken = "";
        this.roles = [];
        // TODO 删除菜单 删除tab
        resolve();
      });
    },
  },
  persist: {
    enabled: true,
    // strategies: [
    //   {
    //     storage: "localStorage",
    //     key: website.storageKey,
    //   },
    // ],
  },
});

export default userStore;
