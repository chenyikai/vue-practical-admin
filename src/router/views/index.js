import Layout from "@/views/layout-page/index.vue";
import website from "@/config/website.js";

// 未配置在菜单中的视图页面
export default [
  {
    path: "/",
    name: "首页",
    component: Layout,
    children: [
      {
        path: website.indexPage,
        name: "仪表盘",
        meta: {
          isTab: true,
        },
        component: () => import("@/views/index-page/index.vue"),
      },
      {
        path: "menu",
        name: "MenuPage",
        component: () => import("@/views/menu-page/index.vue"),
      },
      {
        path: "sys/menu/index",
        name: "SystemMenu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("@/views/sys/menu/index.vue"),
      },
    ],
  },
  // {
  //   path: "/myiframe",
  //   component: Layout,
  //   redirect: "/myiframe",
  //   children: [
  //     {
  //       path: ":routerPath",
  //       name: "iframe",
  //       component: () =>
  //         import(/* webpackChunkName: "page" */ "@/page/Layout/iframe.vue"),
  //       props: true,
  //     },
  //   ],
  // },
  // {
  //   path: "*",
  //   name: "页面不存在",
  //   meta: {
  //     isTab: true,
  //     isAuth: false,
  //   },
  //   component: () =>
  //     import(/* webpackChunkName: "error-page" */ "@/page/ErrorPage/404.vue"),
  // },
];
