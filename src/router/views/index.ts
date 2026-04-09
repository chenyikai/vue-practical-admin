import type { RouteRecordRaw } from "vue-router";
import website from "@/config/website";

export const notFoundRecord: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  name: "页面不存在",
  meta: {
    isTab: true,
    isAuth: false,
  },
  component: () => import(/* webpackChunkName: "error-pages" */ "@/pages/ErrorPage/404.vue"),
};

const views: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/pages/Layout/index.vue"),
    children: [
      {
        path: website.indexPage,
        name: "主页",
        meta: { isTab: true },
        component: () => import("@/views/index.vue"),
      },
    ],
  },
];

export default views;
