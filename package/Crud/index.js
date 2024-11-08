import Crud from "./src/index.vue";

export default function install(app) {
  app.component(Crud.name, Crud);
}
