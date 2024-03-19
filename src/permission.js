/**
 * 全站权限配置
 *
 */
import router, { setTitle } from "@/router/index.js";
import { tabStore } from "@/store/index.js";
import { userStore } from "@/store/index.js";
import { validatenull } from "@/utils/validate.js";

router.beforeEach((to, from, next) => {
  // 缓冲设置
  if (
    to.meta.keepAlive === 0 &&
    tabStore()["tabList"].some((ele) => {
      return ele.value === to.fullPath;
    })
  ) {
    to.meta.$keepAlive = true;
  } else {
    to.meta.$keepAlive =
      to.meta.keepAlive === 0 && validatenull(to.meta.$keepAlive);
  }

  const meta = to.meta || {};
  if (userStore()["accessToken"]) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      userStore().getDictAll();

      // NOTE: 当用户角色不存在时，会存在无限请求用户信息接口的问题
      if (userStore()["roles"].length === 0) {
        userStore()
          .getUserInfo()
          .then(() => {
            const value = to.query.src || to.fullPath;
            const label = to.query.name || to.name;
            const icon = to.query.icon || to.meta.icon;
            const meta = to.meta || router.$acRouter.meta || {};
            if (
              meta.isTab !== false &&
              !validatenull(value) &&
              !validatenull(label)
            ) {
              tabStore().add({
                label,
                value,
                params: to.params,
                query: to.query,
                meta,
                icon,
              });
            }

            next();
          })
          .catch(() => {
            userStore()
              .fedLogOut()
              .then(() => {
                next({ path: "/login" });
              });
          });
      } else {
        const value = to.query.src || to.fullPath;
        const label = to.query.name || to.name;
        const icon = to.query.icon || to.meta.icon;
        const meta = to.meta || router.$acRouter.meta || {};
        if (
          meta.isTab !== false &&
          !validatenull(value) &&
          !validatenull(label)
        ) {
          tabStore().add({
            label,
            value,
            params: to.params,
            query: to.query,
            meta,
            icon,
          });
        } else {
          tabStore().clean();
        }
        next();
      }
    }
  } else {
    if (meta.isAuth === false) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach((to) => {
  const title = to.name || to.params.name || to.query.name;
  setTitle(title);
});
