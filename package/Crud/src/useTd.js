import { ref, computed, toRefs, defineEmits } from "vue";

export default (props) => {
  const { column, scope } = toRefs(props);

  const emit = defineEmits(["td-change"]);

  const config = computed(() => {
    if (typeof column.value?.config === "function") {
      return column.value?.config(scope.value.row, scope.value) || {};
    } else {
      return column.value?.config || {};
    }
  });

  const value = computed({
    get() {
      return scope.value.row[column.value.prop];
    },
    set(val) {
      onTdChange(val);
    },
  });

  const editabled = computed(() => !!scope.value.editabled);

  const currentTd = ref({});

  function onTdChange(val) {
    emit("td-change", val);
  }

  return {
    column,
    scope,
    config,
    value,
    editabled,
    currentTd,
    onTdChange,
  };
};
