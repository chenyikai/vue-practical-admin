import SignBoard from "./src/index.vue";

export default function install(app) {
  app.component(SignBoard.name, SignBoard);
}
