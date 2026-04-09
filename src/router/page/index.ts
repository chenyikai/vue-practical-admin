import type { RouteRecordRaw } from "vue-router";
import website from "@/config/website";

const pages: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "登陆",
    component: () => import(/* webpackChunkName: "login" */ "@/pages/Login/index.vue"),
    meta: { keepAlive: true, isTab: false, isAuth: false },
  },
  {
    path: "/website",
    name: "门户",
    component: () => import(/* webpackChunkName: "login" */ "@/views/website/index.vue"),
    meta: { keepAlive: true, isTab: false, isAuth: false },
  },
  {
    path: "/map",
    name: "监管一张图",
    component: () => import(/* webpackChunkName: "map" */ "@/viewport/Map/index.vue"),
    meta: { keepAlive: true, isTab: false, isAuth: true },
  },
  {
    path: "/",
    redirect: { path: website.indexPage },
  },
];

export default pages;
