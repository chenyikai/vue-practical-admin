import AdminContainer from "./Container";
import PageButton from "./Button";
import PageDialog from "./Dialog";
import VerticalStretchBox from "./VerticalStretchBox";
const components = [AdminContainer, PageButton, PageDialog, VerticalStretchBox];

export default function install(app) {
  components.forEach((install) => install(app));
}
