import Button from "./src/index.vue";

console.log(Button, "Button");

export default function install(app) {
  app.component(Button.name, Button);
}
