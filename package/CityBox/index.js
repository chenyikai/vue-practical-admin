import CityBox from "./src";

export default function install(app) {
  app.component(CityBox.name, CityBox);
}
