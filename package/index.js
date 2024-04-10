import AdminContainer from "./Container";
import PageButton from "./Button";
import PageDialog from "./Dialog";
import VerticalStretchBox from "./VerticalStretchBox";
import SvgIcon from "./SvgIcon";
import UploadFile from "./Upload";
import PicZoom from "./PicZoom";
const components = [
  AdminContainer,
  PageButton,
  PageDialog,
  VerticalStretchBox,
  SvgIcon,
  UploadFile,
  PicZoom,
];

export default function install(app) {
  components.forEach((install) => install(app));
}
