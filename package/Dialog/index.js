import Dialog from "./src/index.vue";

// const dialogTop = window.innerHeight * 0.15;
// console.log(dialogTop, "dialogTop");

export default function install(app) {
  app.component(Dialog.name, Dialog);
}
