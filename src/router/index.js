import { createRouter, createWebHashHistory } from "vue-router";
import views from "./views/index.js";
import pages from "./page/index.js";
import website from "@/config/website.js";

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes: [...pages, ...views],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {
        x: 0,
        y: to.meta.savedPosition || 0,
      };
    }
  },
});

const viewsModules = import.meta.glob("../views/**/*.vue");
const pagesModules = import.meta.glob("../pages/**/*.vue");

function isURL(s) {
  if (s.includes("html")) return true;
  return /^http[s]?:\/\/.*/.test(s);
}

export function addRoute(aMenu, first) {
  if (aMenu.length === 0) return;

  const propsConfig = website.menu.props;
  const propsDefault = {
    label: propsConfig.label || "menuName",
    path: propsConfig.path || "path",
    icon: propsConfig.icon || "icon",
    children: propsConfig.children || "children",
    meta: propsConfig.meta || "meta",
  };

  for (let i = 0; i < aMenu.length; i++) {
    const oMenu = aMenu[i];

    // 不重复添加
    if (router.hasRoute(oMenu[propsDefault["path"]])) return;
    const isChild = oMenu[propsDefault.children].length !== 0;
    const path = (() => {
      if (first) {
        // 将 '/index' 替换为 ''
        return oMenu[propsDefault.path].replace("/index", "");
      } else {
        return oMenu[propsDefault.path];
      }
    })();
    const redirect = (() => {
      // 第一次进来但是没有子路由的 需要添加redirect
      if (!isChild && first && !isURL(this.path)) return `${this.path}/index`;
      else return "";
    })();
    const name = oMenu[propsDefault.label];
    const icon = oMenu[propsDefault.icon];
    const component = (() => {
      let component = null;
      if (first) {
        component = pagesModules[`../pages/Layout/index.vue`];
      } else if (isChild && !first) {
        component = pagesModules[`../pages/Layout/default.vue`];
      } else {
        component = viewsModules[`../views${oMenu.path}.vue`];
      }
      return component;
    })();
    const children = (() => {
      let _children = oMenu[propsDefault.children];
      if (!isChild) {
        if (!first) return [];

        if (!isURL(path)) oMenu[propsDefault.path] = `${path}/index`;

        return [
          {
            component,
            icon: icon,
            name: name,
            meta: meta,
            path: "index",
          },
        ];
      } else {
        return addRoute(_children, false);
      }
    })();
    let meta = oMenu[propsDefault.meta] || {};
    meta = Object.assign(
      meta,
      (function () {
        if (oMenu.keepAlive === 0) {
          return {
            keepAlive: oMenu.keepAlive,
            $keepAlive: true,
          };
        }
      })(),
    );

    const route = {
      path,
      redirect,
      name,
      icon,
      component,
      children,
      meta,
    };
    router.addRoute("Layout", route);
  }
}

export default router;
