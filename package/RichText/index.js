import RichText from "./src/index.vue";

export default function install(app) {
  app.component(RichText.name, RichText);
}
