import AdminContainer from "./Container";
import PageButton from "./Button";
import PageDialog from "./Dialog";
import VerticalStretchBox from "./VerticalStretchBox";
import SvgIcon from "./SvgIcon";
const components = [
  AdminContainer,
  PageButton,
  PageDialog,
  VerticalStretchBox,
  SvgIcon,
];

export default function install(app) {
  components.forEach((install) => install(app));
}
