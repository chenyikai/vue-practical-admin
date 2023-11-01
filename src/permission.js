/**
 * 全站权限配置
 *
 */
import router from "@/router/index.js";

router.beforeEach((to, from, next) => {
  // console.log(to, from);
  next();
});

// router.afterEach((to) => {
//   const title = to.name || to.params.name || to.query.name;
//   router.$acRouter.setTitle(title);
// });
