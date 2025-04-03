import { throttle } from "lodash";

let leading = false;
let trailing = false;
let wait = 300;
let func = null;

const directive = {
  mounted(el, binding) {
    leading = !!binding.modifiers.leading;
    trailing = !!binding.modifiers.trailing;
    wait = binding.arg || 300;

    func = throttle(binding.value, wait, {
      leading,
      trailing,
    });

    el.addEventListener("click", func);
  },
  unmounted(el) {
    el.removeEventListener("click", func);

    leading = false;
    trailing = false;
    wait = 300;
    func = null;
  },
};

export default {
  name: "throttle",
  directive,
};
