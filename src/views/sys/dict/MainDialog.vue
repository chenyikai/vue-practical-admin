<script>
export default {
  name: "MainDialog",
};
</script>

<script setup>
import { reactive, ref } from "vue";
import { formOption } from "./options.js";
const dialog = ref({});
const form = ref({});
const formData = reactive({});
function open() {
  dialog.value.open();
}

function handleSubmit(done) {
  form.value.validate((valid) => {
    if (valid) {
      done(true);
    }
  });
}

defineExpose({
  open,
});
</script>

<template>
  <page-dialog ref="dialog" @submit="handleSubmit">
    <avue-form ref="form" :option="formOption" v-model="formData" />
  </page-dialog>
</template>
