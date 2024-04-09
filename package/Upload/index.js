import UploadFile from "./src/index.vue";

export default function install(app) {
  app.component(UploadFile.name, UploadFile);
}
