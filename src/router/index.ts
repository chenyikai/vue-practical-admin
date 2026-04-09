import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import views, { notFoundRecord } from "./views/index";
import pages from "./page/index";
import website from "@/config/website";
import { isURL, validatenull } from "@/utils/validate";
import { menuStore } from "@/store/index";
import { getStore } from "@/utils/store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...pages, ...views],
  scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalized, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (from.meta["keepAlive"]) {
      from.meta["savedPosition"] = document.body.scrollTop;
    }
    return { left: 0, top: (to.meta["savedPosition"] as number) || 0 };
  },
});

type VueModules = Record<string, () => Promise<unknown>>;
const modules: VueModules = import.meta.glob("../**/**/*.vue");

interface MenuRecord {
  path?: string;
  [key: string]: unknown;
}

export function addRoutes(aMenu: MenuRecord[], parent = "Layout"): void {
  if (validatenull(aMenu) || !Array.isArray(aMenu) || aMenu.length === 0) {
    return;
  }

  const propsDefault = website.menu.props;

  aMenu
    .filter((item) => !validatenull(item[propsDefault.path]))
    .forEach((oMenu) => {
      const id = oMenu[propsDefault.id] as string | number;
      const path = oMenu[propsDefault.path] as string;
      const name = oMenu[propsDefault.label] as string;
      const icon = oMenu[propsDefault.icon] as string;
      const rawChildren = oMenu[propsDefault.children];
      // FIX: 原代码递归时硬编码 item.children，已修正为使用 propsDefault.children
      const children = (Array.isArray(rawChildren) ? rawChildren : []).filter(
        (item: MenuRecord) => !validatenull(item[propsDefault.path]),
      ) as MenuRecord[];
      const meta = oMenu[propsDefault.meta] as Record<string, unknown> | undefined;
      const hasChild = children.length > 0;
      const isHttp = path.includes("https://") || path.includes("http://");

      const component = (() => {
        if (isHttp) {
          return modules[`../pages/IFramePage/index.vue`];
        }
        if (hasChild) {
          return modules[`../pages/MenuGroup/index.vue`];
        }
        return modules[`../views${path}.vue`] ?? modules[`../pages/ErrorPage/404.vue`];
      })();

      // 若组件未找到则跳过此路由
      if (!component) {
        return;
      }

      const record = {
        path: isHttp ? "/iframe" : path,
        name,
        meta: { ...meta, id, name, icon },
        props: { meta: oMenu },
        component,
        children: [] as unknown[],
      };

      router.addRoute(parent, record as RouteRecordRaw);

      if (hasChild) {
        addRoutes(children, name);
      }
    });
}

export function initRoutes(menu?: MenuRecord[]): void {
  try {
    // menuStore().menuList 类型为 MenuItem[]，永不为 null，直接作为 fallback
    const menuData =
      menu ??
      ((menuStore().menuList as MenuRecord[]).length > 0
        ? (menuStore().menuList as MenuRecord[])
        : ((getStore({ name: "menu" }) as MenuRecord[] | undefined) ?? []));
    addRoutes(menuData);
    router.addRoute("Layout", notFoundRecord);
  } catch (e) {
    console.error("路由初始化失败", e);
  }
}

export function setTitle(title?: string): void {
  document.title = title ? `${title}-${website.title}` : website.title;
}

function objToForm(obj: Record<string, unknown>): string {
  return Object.keys(obj)
    .map((key) => `${key}=${String(obj[key])}`)
    .join("&");
}

export function getPath(params: { src?: string; [key: string]: unknown }): string {
  const { src } = params;
  const result = src ?? "/";
  if (src && isURL(src)) {
    return `/myiframe/urlPath?${objToForm(params)}`;
  }
  return result;
}

export function go2MenuPage(menu: MenuRecord): void {
  const path = menu[website.menu.props.path] as string;
  const isHttp = path.includes("https://") || path.includes("http://");
  void router.push({ path: isHttp ? "iframe" : path });
}

initRoutes();

export default router;
