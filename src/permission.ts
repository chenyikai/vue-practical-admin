/**
 * 全站权限配置
 */
import router, { setTitle } from "@/router/index";
import { tabStore, menuStore, userStore } from "@/store/index";
import { validatenull } from "@/utils/validate";
import website from "@/config/website";

router.beforeEach((to, _from, next) => {
  // 缓冲设置
  if (to.meta["keepAlive"] === 0 && tabStore().tabList.some((ele) => ele.value === to.fullPath)) {
    to.meta["$keepAlive"] = true;
  } else {
    to.meta["$keepAlive"] = to.meta["keepAlive"] === 0 && validatenull(to.meta["$keepAlive"]);
  }

  const meta = to.meta;

  if (userStore().accessToken) {
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      void userStore().getDictAll();

      if (userStore().roles.length === 0) {
        userStore()
          .getUserInfo()
          .then(() => {
            const value = (to.query["src"] as string | undefined) ?? to.fullPath;
            const label = (to.query["name"] as string | undefined) ?? String(to.name ?? "");
            const icon =
              (to.query["icon"] as string | undefined) ??
              (meta["icon"] as string | undefined) ??
              "";
            if (meta["isTab"] !== false && !validatenull(value) && !validatenull(label)) {
              tabStore().add({
                label,
                value,
                params: to.params as Record<string, unknown>,
                query: to.query as Record<string, string | string[]>,
                meta,
                icon,
              });
            }
            next();
          })
          .catch(() => {
            void userStore()
              .fedLogOut()
              .then(() => {
                next({ path: "/login" });
              });
          });
      } else {
        const value = (to.query["src"] as string | undefined) ?? to.fullPath;
        const label = (to.query["name"] as string | undefined) ?? String(to.name ?? "");
        const icon =
          (to.query["icon"] as string | undefined) ?? (meta["icon"] as string | undefined) ?? "";
        if (meta["isTab"] !== false && !validatenull(value) && !validatenull(label)) {
          tabStore().add({
            label,
            value,
            params: to.params as Record<string, unknown>,
            query: to.query as Record<string, string | string[]>,
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
    if (meta["isAuth"] === false) {
      next();
    } else {
      next("/login");
    }
  }
});

router.afterEach((to) => {
  const menuId = to.query["id"];
  if (!validatenull(menuId)) {
    const menuItem = menuStore().getMenu(menuId as string | number);
    setTitle(menuItem?.[website.menu.props.label] as string | undefined);
    return;
  }
  const title = to.name ?? to.params["name"] ?? to.query["name"];
  setTitle(title as string | undefined);
});
