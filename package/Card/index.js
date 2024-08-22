import Card from "./src/index.vue";

export default function install(app) {
  app.component(Card.name, Card);
}
