import { createRouter, createWebHashHistory } from "vue-router";
import views from "./views/index.js";
import pages from "./page/index.js";
import website from "@/config/website.js";
import { isURL } from "@/utils/validate.js";
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

export function addRoute(aMenu = [], first) {
  const aRouter = [];
  const propsDefault = website.menu.props;
  if (aMenu && aMenu.length === 0) return;
  for (let i = 0; i < aMenu.length; i++) {
    const oMenu = aMenu[i];
    let path = oMenu[propsDefault.path],
      component = oMenu.component,
      name = oMenu[propsDefault.label],
      icon = oMenu[propsDefault.icon],
      children = oMenu[propsDefault.children],
      query = oMenu[propsDefault.query],
      meta = oMenu[propsDefault.meta];
    const isChild = !!(children && children.length !== 0);
    const oRouter = {
      path: path,
      component: (() => {
        // 判断是否为首路由
        if (first) {
          return modules["../pages/Layout/index.vue"];
          // 判断是否为多层路由
        } else if (isChild && !first) {
          return modules[`../pages/Layout/index.vue`];
          // 判断是否为最终的页面视图
        } else {
          return modules[`../views${oMenu.path}.vue`];
        }
      })(),
      name,
      meta: { ...meta, icon },
      query,
      redirect: (() => {
        if (!isChild && first) return `${path}`;
        else return "";
      })(),
      // 处理是否为一级路由
      children: !isChild
        ? (() => {
            if (first) {
              oMenu[propsDefault.path] = `${path}`;
              let result = modules[`../views${oMenu.path}.vue`];
              if (result) result().then((mod) => (mod.default.name = path));
              else {
                console.log(component + "不存在");
              }
              return [
                {
                  component: result,
                  name: name,
                  meta: { ...meta, icon },
                  query: query,
                  path: "",
                },
              ];
            }
            return [];
          })()
        : (() => {
            return addRoute(children, false);
          })(),
    };
    if (!isURL(path)) aRouter.push(oRouter);
  }
  if (first) {
    aRouter.forEach((ele) => router.addRoute(ele));
  } else {
    return aRouter;
  }
}

addRoute(menuStore["menuList"] || getStore({ name: "menu" }), true);

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
  if (menu.children.length !== 0) {
    router.push({
      name: "MenuPage",
      // params: {
      //   name: menu["menuName"],
      // },
      query: { id: menu["id"] },
    });
  } else {
    const path = website.menu.props.path;
    router.push({ path: menu[path] });
  }
}

export default router;
