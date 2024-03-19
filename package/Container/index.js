import Container from "./src/index.vue";

export default function install(app) {
  app.component(Container.name, Container);
}
