import AdminContainer from "./Container/index.vue";
import PageButton from "./Button/index.vue";
const components = [AdminContainer, PageButton];

export default function install(app) {
  components.forEach((component) => {
    app.component(component.name, component);
  });
}
