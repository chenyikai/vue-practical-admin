<script>
export default {
  name: "LimitSettingCard",
};
</script>

<script setup>
import { CloseBold, Select } from "@element-plus/icons-vue";
import { ref } from "vue";
import { updateRoleLitmit } from "@/api/sys/role/index.js";
import { getRoleMenuById } from "@/api/sys/menu/index.js";
import { ElMessage } from "element-plus";
import { debounce } from "lodash";
import SvgIcon from "package/SvgIcon/src/index.vue";
const emits = defineEmits({ setting: null });

const tree = ref({});
const currentRoleInfo = ref({});

defineProps({
  menuData: {
    type: Array,
    default: () => {
      return [];
    },
  },
});

const defaultProps = {
  children: "children",
  label: "menuName",
};

function init(info) {
  currentRoleInfo.value = info;

  getRoleMenuById(info.id).then(({ data }) => {
    if (Array.isArray(data.data)) {
      tree.value.setCheckedKeys(getTreeLowestLevelIds(data.data));
    } else {
      tree.value.setCheckedNodes([]);
    }
  });
}

function updateRoleMenuData() {
  updateRoleLitmit({
    id: currentRoleInfo.value.id,
    menuIds: [
      ...tree.value.getCheckedKeys(),
      ...tree.value.getHalfCheckedKeys(),
    ],
  }).then(() => {
    ElMessage({
      message: "更新角色菜单成功",
      type: "success",
    });
  });
}

const submit = debounce(
  function () {
    updateRoleMenuData();
  },
  500,
  {
    leading: true,
    trailing: false,
  },
);

function getTreeLowestLevelIds(tree) {
  let list = [];
  for (const item of tree) {
    if (item.children.length === 0) {
      list.push(item.id);
    } else {
      list = list.concat(getTreeLowestLevelIds(item.children));
    }
  }
  return list;
}

defineExpose({
  init,
});
</script>

<template>
  <section class="limit-setting-card-container">
    <header class="limit-setting-card-container-header">
      <h1 class="page-title">
        <svg-icon name="limit" class="icon" />
        <span class="label">权限配置</span>
        <span v-if="currentRoleInfo.roleName" class="label"
          >({{ currentRoleInfo.roleName }})</span
        >
      </h1>
      <div class="button-group">
        <el-button type="success" :icon="Select" circle @click.stop="submit" />
        <el-button
          type="danger"
          :icon="CloseBold"
          circle
          @click.stop="emits('setting', {})" />
      </div>
    </header>
    <el-divider class="divider-line" style="margin-top: 15px" />
    <main class="limit-setting-card-container-main">
      <el-tree
        ref="tree"
        class="role-menu-tree"
        :data="menuData"
        default-expand-all
        show-checkbox
        node-key="id"
        :props="defaultProps" />
    </main>
  </section>
</template>

<style scoped lang="scss">
@import "src/styles/variables";
.limit-setting-card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  @include container();
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0;
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .page-title {
      display: flex;
      align-items: center;
      margin: 0;
      font-size: 16px;
      color: #fff;
      .icon {
        width: 24px;
        height: 24px;
        margin-right: 6px;
      }
    }
    .shrink-btn {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }
  }
  &-main {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
