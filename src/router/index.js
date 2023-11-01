import { createRouter, createWebHashHistory } from "vue-router";
import views from "./views/index.js";
import pages from "./page/index.js";
// import AochenRouter from "./aochen-router.js";

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

const originalPush = router.__proto__.push;

router.__proto__.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

router.addRoutes([...pages, ...views]);
// AochenRouter.install(router, store); // 初始化和注册 acRouter

// router.$acRouter.formatRoutes(store.getters.menuAll, true); // 动态路由核心方法

export default router;
