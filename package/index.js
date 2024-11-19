import AdminContainer from "./Container";
import PageButton from "./Button";
import PageDialog from "./Dialog";
import VerticalStretchBox from "./VerticalStretchBox";
import SvgIcon from "./SvgIcon";
import UploadFile from "./Upload";
import PicZoom from "./PicZoom";
import AdminCard from "./Card";
import IconBox from "./IconBox";
import Crud from "./Crud";
import SignBoard from "./SignBoard";
const components = [
  AdminContainer,
  PageButton,
  PageDialog,
  VerticalStretchBox,
  SvgIcon,
  UploadFile,
  PicZoom,
  AdminCard,
  IconBox,
  Crud,
  SignBoard,
];

export default function install(app) {
  components.forEach((install) => install(app));
}
