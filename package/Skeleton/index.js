import Skeleton from "./src/index.vue";

export default function install(app) {
  app.component(Skeleton.name, Skeleton);
}
