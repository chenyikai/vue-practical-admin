import { ref, computed, toRefs } from "vue";

export default (props) => {
  const { column, scope } = toRefs(props);

  const config = computed(() => {
    if (typeof column.value?.config === "function") {
      return column.value?.config(scope.value.row, scope.value) || {};
    } else {
      return column.value?.config || {};
    }
  });

  const value = computed(() => {
    return scope.value.row[column.value.prop];
  });

  const editabled = computed(() => !!scope.value.editabled);

  const currentTd = ref({});

  return {
    column,
    scope,
    config,
    value,
    editabled,
    currentTd,
  };
};
