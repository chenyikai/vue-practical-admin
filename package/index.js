import AdminContainer from "./Container";
import PageButton from "./Button";
import PageDialog from "./Dialog";
const components = [AdminContainer, PageButton, PageDialog];

export default function install(app) {
  components.forEach((install) => install(app));
}
