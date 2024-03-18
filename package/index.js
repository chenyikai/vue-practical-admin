import AdminContainer from "./Container/index.vue";
import PageButton from "./Button/index.vue";
import PageDialog from "./Dialog/index.vue";
const components = [AdminContainer, PageButton, PageDialog];

export default function install(app) {
  components.forEach((component) => {
    app.component(component.name, component);
  });
}
