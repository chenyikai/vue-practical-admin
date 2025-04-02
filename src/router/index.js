import { createRouter, createWebHashHistory } from "vue-router";
import views, { notFoundRecord } from "./views/index.js";
import pages from "./page/index.js";
import website from "@/config/website.js";
import { isURL, validatenull } from "@/utils/validate.js";
import { menuStore } from "@/store/index.js";
import { getStore } from "@/utils/store.js";

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

const modules = import.meta.glob("../**/**/*.vue");

export function addRoutes(aMenu, parent = "Layout") {
  if (validatenull(aMenu) || !Array.isArray(aMenu) || aMenu.length === 0) {
    return;
  }

  const propsDefault = website.menu.props;

  aMenu.forEach((oMenu) => {
    let record = {};

    const id = oMenu[propsDefault.id];
    const path = oMenu[propsDefault.path];
    const name = oMenu[propsDefault.label];
    const icon = oMenu[propsDefault.icon];
    const children = oMenu[propsDefault.children];
    const meta = oMenu[propsDefault.meta];

    const hasChild = Array.isArray(children) && children.length > 0;
    const isHttp =
      path.indexOf("https://") !== -1 || path.indexOf("http://") !== -1;

    record = {
      path: (() => {
        if (isHttp) {
          return "/iframe";
        } else {
          return path;
        }
      })(),
      name,
      meta: (() => {
        return {
          ...meta,
          id,
          name,
          icon,
        };
      })(),
      props: {
        meta: oMenu,
      },
      component: (() => {
        if (isHttp) {
          return modules[`../pages/IFramePage/index.vue`];
        }

        if (hasChild) {
          return modules[`../pages/MenuGroup/index.vue`];
        } else {
          const module = modules[`../views${oMenu.path}.vue`];
          return module ? module : modules[`../pages/ErrorPage/404.vue`];
        }
      })(),
      children: hasChild ? addRoutes(children) : [],
    };

    router.addRoute(parent, record);

    return record;
  });
}

export function initRoutes(menu) {
  addRoutes(menu || menuStore["menuList"] || getStore({ name: "menu" }));
  router.addRoute("Layout", notFoundRecord);
}

export function setTitle(title) {
  title = title ? `${title}-${website.title}` : website.title;
  document.title = title;
}

function objToform(obj) {
  const result = [];
  Object.keys(obj).forEach((ele) => {
    result.push(`${ele}=${obj[ele]}`);
  });
  return result.join("&");
}

export function getPath(params) {
  const { src } = params;
  let result = src || "/";
  if (isURL(src)) {
    result = `/myiframe/urlPath?${objToform(params)}`;
  }
  return result;
}

export function go2MenuPage(menu) {
  const path = menu[website.menu.props.path];
  const isHttp =
    path.indexOf("https://") !== -1 || path.indexOf("http://") !== -1;

  if (isHttp) {
    router.push({ path: "iframe" });
  } else {
    router.push({ path });
  }
}

initRoutes();

export default router;
