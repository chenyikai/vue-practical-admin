export default [
  {
    path: "/",
    name: "LayoutPage",
    component: () => import("@/view/layout-page/index.vue"),
    redirect: "index",
    children: [
      {
        path: "index",
        name: "Index",
        meta: {
          title: "首页",
        },
        component: () => import("@/view/index-page/index.vue"),
      },
      {
        path: "menu",
        name: "MenuPage",
        component: () => import("@/view/menu-page/index.vue"),
      },
      {
        path: "sys/menu/index",
        name: "SystemMenu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("@/view/sys/menu/index.vue"),
      },
    ],
  },
];
