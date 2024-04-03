import Layout from "@/pages/Layout/index.vue";
import website from "@/config/website.js";

// 未配置在菜单中的视图页面
export default [
  {
    path: "/",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: website.indexPage,
        name: "主页",
        meta: {
          isTab: true,
        },
        component: () => import("@/views/index.vue"),
      },
      {
        path: "menu",
        name: "MenuPage",
        meta: {
          isTab: true,
        },
        component: () => import("@/views/menu-page/index.vue"),
      },
      {
        path: "/:pathMatch(.*)*", // 解决动态路由页面刷新的警告
        name: "页面不存在",
        meta: {
          isTab: true,
          isAuth: false,
        },
        component: () =>
          import(
            /* webpackChunkName: "error-pages" */ "@/pages/ErrorPage/404.vue"
          ),
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
  //         import(/* webpackChunkName: "pages" */ "@/pages/Layout/iframe.vue"),
  //       props: true,
  //     },
  //   ],
  // },
];
