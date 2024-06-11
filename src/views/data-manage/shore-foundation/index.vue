<script>
export default {
  name: "ShoreFoundationBox",
};
</script>

<script setup>
import { onBeforeMount, ref, onBeforeUnmount } from "vue";
import useCrud from "@/hooks/useCrud.js";
import PageButton from "package/Button/src/index.vue";
import { crudOption } from "./options.js";
import {
  getPoiTInfoShorePage,
  createPoiTInfoShore,
  updatePoiTInfoShore,
  batchDeletePoiTInfoShore,
  addFeedbackPoiTInfoShore,
  updateFeedbackPoiTInfoShore,
  auditShoreFeedbackPoiTInfoShore,
  publishPoiTInfoShore,
  syncDataOnePoiTInfoShore,
  auditSyncDataPoiTInfoShore,
  downloadTemplatePoiTInfoShore,
  exportDataPoiTInfoShore,
  restPublishPoiTInfoShore,
} from "@/api/data-manage/index.js";
import { getPoiTTypeShoreAllType } from "@/api/type-manage/index.js";
import { ElMessage, ElMessageBox } from "element-plus";
import MainDialog from "./MainDialog.vue";
import FeedbackDialog from "./FeedbackDialog.vue";
import ReviewDialog from "./ReviewDialog.vue";
import PublishDialog from "./PublishDialog.vue";
import website from "@/config/website.js";
import { getDictData } from "@/utils/util.js";
import { validatenull } from "@/utils/validate.js";
import MapBox from "../map.vue";
import _ from "lodash";
import { parse } from "wellknown";
import { bbox, circle, lineString } from "@turf/turf";
import { userStore } from "@/store/index.js";
import { downloadBlobStream } from "@/utils/down.js";
import FileDialog from "@/views/data-manage/FileDialog.vue";
const source = userStore().$state.userInfo.source === 1; // 是否为超级管理员
const crud = ref(null);
const file = ref(null);

const {
  dialog,
  funcList,
  listQuery,
  pagination,
  mainTableData,
  tableLoading,
  getList,
  sortChange,
  sizeChange,
  handleFilter,
  currentChange,
  handelResetSearchForm,
} = useCrud();

const toggleList = ref([]);
const feedback = ref(null);
const review = ref(null);
const publish = ref(null);

const hqDicData = ref([]);
const lxDicData = ref([]);
function getDicData(callback) {
  Promise.all([getPoiTTypeShoreAllType()]).then(([lxData]) => {
    lxDicData.value = lxData.data.data || [];
    crud.value.updateDic("typeCode", lxDicData.value);
    hqDicData.value = getDictData("sea_area_type", "string").map((item) => {
      return { code: item.value, name: item.label };
    });
    crud.value.updateDic("seaCode", hqDicData.value);
    callback();
  });
}

function onAdd() {
  dialog.value.open(website.pageStatus.CREATE, {
    pageWebsite: website.pageStatus.CREATE,
  });
}

function onUpdate(rowData) {
  dialog.value.open(website.pageStatus.UPDATE, rowData);
}

function onFeedback(rowData) {
  if (rowData.feedbackStatus === 3 || rowData.feedbackStatus === null) {
    feedback.value.open(website.pageStatus.FEEDBACK, rowData);
  } else if (rowData.feedbackStatus === 1 || rowData.feedbackStatus === 2) {
    feedback.value.open(website.pageStatus.MODIFI, rowData);
  }
}

function onReview(rowData) {
  review.value.open(website.pageStatus.REVIEW, rowData);
}

function onPublish(rowData) {
  if (source) {
    publish.value.open(website.pageStatus.REVPUBLISH, rowData);
  } else {
    publish.value.open(website.pageStatus.PUBLISH, rowData);
  }
}

function onCreateSubmit(formData, done) {
  createPoiTInfoShore(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "新增成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "新增失败",
        type: "error",
      });
      done();
    });
}

function onUpdateSubmit(formData, done) {
  updatePoiTInfoShore(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "修改成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "修改失败",
        type: "error",
      });
      done();
    });
}

function onAddFeedbackSubmit(formData, done) {
  // 应用级新增反馈
  let data = { ...formData, feedbackId: formData.id };
  delete data.id;
  addFeedbackPoiTInfoShore(data)
    .then(() => {
      done(true);
      ElMessage({
        message: "提交反馈成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "提交反馈失败",
        type: "error",
      });
      done();
    });
}

function onUpdateFeedbackSubmit(formData, done) {
  // 应用级修改反馈
  updateFeedbackPoiTInfoShore({ ...formData, feedbackStatus: 1 })
    .then(() => {
      done(true);
      ElMessage({
        message: "修改反馈成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "修改反馈失败",
        type: "error",
      });
      done();
    });
}

function onAuditFeedbackSubmit(formData, done) {
  // 超管审核
  auditShoreFeedbackPoiTInfoShore(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "审核成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "审核失败",
        type: "error",
      });
      done();
    });
}

function deletesDataSubmit() {
  if (toggleList.value.length > 0) {
    const ids = _.map(toggleList.value, "id");
    ElMessageBox.confirm(`是否确认删除${ids.length}条数据？`, "提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        return batchDeletePoiTInfoShore(ids);
      })
      .then(() => {
        ElMessage({
          message: "删除成功!",
          type: "success",
        });
        handleFilter();
      });
  } else {
    ElMessage({
      message: "至少需要勾选1项进行操作",
      type: "warning",
    });
  }
}

function syncDataSubmit() {
  if (toggleList.value.length > 0) {
    const ids = _.map(toggleList.value, "id");
    ElMessageBox.confirm(`是否确认发布${ids.length}条数据？`, "批量发布提示", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        return restPublishPoiTInfoShore(ids);
      })
      .then(() => {
        ElMessage({
          message: "批量发布成功!",
          type: "success",
        });
        handleFilter();
      });
  } else {
    ElMessage({
      message: "至少需要勾选1项进行操作",
      type: "warning",
    });
  }
}

function publishGmDataSubmit(rowData) {
  ElMessageBox.confirm(`是否确认发布：${rowData.name}？`, "发布", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      return publishPoiTInfoShore([rowData.id]);
    })
    .then(() => {
      ElMessage({
        message: "删除成功!",
        type: "success",
      });
      handleFilter();
    });
}

function onPublishSubmit(formData, done) {
  // 发起同步
  syncDataOnePoiTInfoShore(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "发起同步成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "发起同步失败",
        type: "error",
      });
      done();
    });
}

function onRevPublishSubmit(formData, done) {
  // 审核同步内容
  auditSyncDataPoiTInfoShore(formData)
    .then(() => {
      done(true);
      ElMessage({
        message: "审核成功",
        type: "success",
      });
      getList();
    })
    .catch(() => {
      ElMessage({
        message: "审核失败",
        type: "error",
      });
      done();
    });
}

function onDownloadTemplate() {
  // 模板下载
  if (listQuery.typeCode) {
    downloadTemplatePoiTInfoShore({ typeCode: listQuery.typeCode }).then(
      ({ data }) => {
        downloadBlobStream(data, "岸基数据导入模板.xlsx", () => {
          ElMessage({
            message: "导出模板成功",
            type: "success",
          });
        });
      },
    );
  } else {
    ElMessage({
      message: "请先选择1种类型",
      type: "warning",
    });
  }
}

function onExportData() {
  // 导出
  if (listQuery.typeCode) {
    const object = lxDicData.value.find((data) => {
      return data.code === listQuery.typeCode;
    });
    exportDataPoiTInfoShore({ typeCode: listQuery.typeCode }).then(
      ({ data }) => {
        downloadBlobStream(data, `${object.name}数据.xlsx`, () => {
          ElMessage({
            message: "导出成功",
            type: "success",
          });
        });
      },
    );
  } else {
    ElMessage({
      message: "请先选择1种类型",
      type: "warning",
    });
  }
}

function onImportData() {
  // 导入
  file.value.open();
}

function tableRowClassName({ row }) {
  if (row.isRepeat === 1) {
    return "repeat-row";
  }
  return "";
}

function onDatePicker() {
  if (!validatenull(listQuery.dateSelect)) {
    listQuery.startDateSelect = listQuery.dateSelect[0];
    listQuery.endDateSelect = listQuery.dateSelect[1];
  }
}

function onSearch() {
  handleFilter();
}

function selectionChange(event) {
  // 列表多选回调
  toggleList.value = event;
  if (map.value.getMapboxDrow().draw) {
    map.value.getMapboxDrow().draw.deleteAll().getAll();
    event.map((item) => {
      const geometry = parse(item.geom);
      let feature = {
        type: "Feature",
        id: `polt-editor-${item.id}`,
        properties: {},
        geometry,
      };
      switch (item.geomType) {
        case 1:
          feature.properties = {
            ...map.value.customPoint,
            "icon-image": getIconData(item) || "point",
            name: item.name,
          };
          break;
        case 2:
          feature.properties = {
            ...map.value.lineString,
            name: item.name,
          };
          break;
        case 3:
          feature.properties = {
            ...map.value.polygon,
            name: item.name,
          };
          break;
        case 4:
          feature.properties = {
            ...map.value.circle,
            name: item.name,
          };
          break;
      }
      if (item.geomType === 4) {
        const e = circle(geometry.coordinates, item.radius, {
          units: "kilometers",
        });
        feature.geometry = e.geometry;
        feature.properties.center = geometry.coordinates;
        feature.properties.radius = item.radius;
      }
      map.value.getMapboxDrow().draw.add(feature);
      map.value.getMapboxDrow().draw.render();
    });
  }
}

function feedbackStyle({ feedbackStatus }) {
  if (feedbackStatus === 3) {
    return "color:#2ed573";
  } else if (feedbackStatus === 1 || feedbackStatus === 5) {
    return "color:#ffa502";
  } else if (feedbackStatus === 2 || feedbackStatus === 6) {
    return "color:#e74c3c";
  }
  return "";
}

function flyTo(row) {
  if (toggleList.value.find((e) => e.id === row.id) === undefined)
    crud.value.toggleSelection([row]);
  const geometry = parse(row.geom);
  if (row.geomType === 3 || row.geomType === 4) {
    const _bbox = bbox(
      lineString(geometry.coordinates[0].map((item) => [item[0], item[1]])),
    );
    map.value.getMapboxDrow().fly(_bbox, 2);
  } else if (row.geomType === 2) {
    const _bbox = bbox(
      lineString(geometry.coordinates.map((item) => [item[0], item[1]])),
    );
    map.value.getMapboxDrow().fly(_bbox, 2);
  } else {
    map.value.getMapboxDrow().fly(geometry.coordinates, 1, 14.5);
  }
}

function getIconData(data) {
  // 根据类型解析并添加icon
  const matchedItem = lxDicData.value.find(
    (item) => item.code === data.typeCode,
  );
  return matchedItem ? matchedItem.icon : undefined;
}

const map = ref(null);

onBeforeMount(() => {
  funcList.page = getPoiTInfoShorePage;
  getDicData(() => {
    getList();
    map.value.initMap(() => {});
  });
});

onBeforeUnmount(() => {
  map.value.closeMap();
});
</script>

<template>
  <page-container class="shore-foundation">
    <template #search>
      <div class="index-page-container-header">
        <el-form
          ref="searchForm"
          :model="listQuery"
          :inline="true"
          label-suffix=":">
          <el-form-item label="关键字" prop="name">
            <el-input
              v-model="listQuery.name"
              placeholder="请输入关键字"
              clearable></el-input>
          </el-form-item>
          <el-form-item label="海区" prop="seaCode">
            <el-select
              v-model="listQuery.seaCode"
              placeholder="请选择海区"
              style="width: 200px">
              <el-option
                v-for="item in hqDicData"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="typeCode">
            <el-select
              v-model="listQuery.typeCode"
              filterable
              remote
              reserve-keyword
              remote-show-suffix
              placeholder="请选择类型"
              style="width: 200px">
              <el-option
                v-for="item in lxDicData"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" prop="pubStatus">
            <el-select
              v-model="listQuery.pubStatus"
              placeholder="请选择发布状态"
              style="width: 200px">
              <el-option
                v-for="item in getDictData('publish_status')"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" prop="feedbackStatus">
            <el-select
              v-model="listQuery.feedbackStatus"
              placeholder="请选择审核状态"
              style="width: 200px">
              <el-option
                v-for="item in getDictData('audit_status')"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间" prop="dateSelect">
            <el-date-picker
              v-model="listQuery.dateSelect"
              type="datetimerange"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY/MM/DD hh:mm:ss"
              value-format="YYYY-MM-DD hh:mm:ss"
              @change="onDatePicker" />
          </el-form-item>
          <el-form-item>
            <page-button type="search" @click.stop="onSearch" />
            <page-button type="reset" @click.prevent="handelResetSearchForm" />
          </el-form-item>
        </el-form>
        <div class="button-group">
          <page-button class="btn" type="create" @click.stop="onAdd()" />
          <page-button class="btn" type="export" @click.stop="onExportData()" />
          <page-button class="btn" type="import" @click.stop="onImportData()" />
          <page-button
            class="btn"
            type="delete"
            @click.stop="deletesDataSubmit()" />
          <page-button
            class="btn"
            icon="download"
            label="下载模板"
            @click.stop="onDownloadTemplate()" />
          <page-button
            v-if="source"
            size="16"
            class="btn"
            icon="publish-all"
            label="批量发布"
            @click.stop="syncDataSubmit()" />
        </div>
      </div>
    </template>
    <template #crud>
      <div class="crud-box">
        <avue-crud
          ref="crud"
          :page="pagination"
          :option="crudOption"
          :data="mainTableData"
          :table-loading="tableLoading"
          :row-class-name="tableRowClassName"
          @size-change="sizeChange"
          @current-change="currentChange"
          @sort-change="sortChange"
          @selection-change="selectionChange">
          <template v-slot:name="{ row }">
            <div class="name-text-box" @click.stop="flyTo(row)">
              {{ row.name }}
            </div>
          </template>
          <template v-slot:feedbackStatus="{ row }">
            <div :style="feedbackStyle(row)">{{ row.$feedbackStatus }}</div>
          </template>
          <template v-slot:menu="{ row }">
            <page-button
              v-if="source && row.feedbackStatus !== 5"
              type="update"
              direction="horizontal"
              @click.stop="onUpdate(row)" />
            <page-button
              v-if="source && row.feedbackStatus === 4 && row.pubStatus === 0"
              icon="publish"
              direction="horizontal"
              label="发布"
              @click.stop="publishGmDataSubmit(row)" />
            <page-button
              v-if="source && row.feedbackStatus === 5 && row.pubStatus === 0"
              icon="feedback"
              direction="horizontal"
              label="审核"
              comments="这个是用于发布的审核"
              @click.stop="onPublish(row)" />
            <page-button
              v-if="source && row.feedbackStatus === 1"
              icon="feedback"
              direction="horizontal"
              label="审核"
              comments="这个是用于反馈的审核"
              @click.stop="onReview(row)" />

            <page-button
              v-if="
                !source &&
                (row.feedbackStatus === 4 || row.feedbackStatus === 6) &&
                row.pubStatus === 0
              "
              icon="publish"
              direction="horizontal"
              label="申请发布"
              @click.stop="onPublish(row)" />
            <page-button
              v-if="!source && row.pubStatus === 1"
              icon="feedback"
              direction="horizontal"
              label="反馈"
              @click.stop="onFeedback(row)" />
          </template>
        </avue-crud>
        <div class="map-box">
          <map-box ref="map" />
        </div>
      </div>
    </template>
    <template #dialog>
      <main-dialog
        ref="dialog"
        :hqDicData="hqDicData"
        :lxDicData="lxDicData"
        @[website.pageStatus.CREATE]="onCreateSubmit"
        @[website.pageStatus.UPDATE]="onUpdateSubmit" />
      <feedback-dialog
        ref="feedback"
        :hqDicData="hqDicData"
        :lxDicData="lxDicData"
        @[website.pageStatus.FEEDBACK]="onAddFeedbackSubmit"
        @[website.pageStatus.MODIFI]="onUpdateFeedbackSubmit" />
      <review-dialog
        ref="review"
        :hqDicData="hqDicData"
        :lxDicData="lxDicData"
        @[website.pageStatus.REVIEW]="onAuditFeedbackSubmit" />
      <publish-dialog
        ref="publish"
        :hqDicData="hqDicData"
        :lxDicData="lxDicData"
        @[website.pageStatus.PUBLISH]="onPublishSubmit"
        @[website.pageStatus.REVPUBLISH]="onRevPublishSubmit" />
      <file-dialog ref="file" @success="getList" />
    </template>
  </page-container>
</template>

<style scoped lang="scss">
.shore-foundation {
  .index-page-container-header {
    display: flex;
    flex-direction: row;
    &::v-global(.el-form) {
      align-items: center;
    }
    .button-group {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      gap: 12px;
      flex-shrink: 0;
      width: 300px;
      height: 100%;
      .btn {
        margin: 0;
      }
    }
  }
  .crud-box {
    display: flex;
    flex-direction: row;
    width: 100%;
    .map-box {
      width: 100%;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .avue-crud {
      .name-text-box {
        cursor: pointer;
      }
      ::v-global(.repeat-row) {
        background: rgba(255, 127, 80, 0.3) !important;
      }
      ::v-global(.el-table tbody tr:hover > td) {
        background-color: rgba(255, 247, 153, 0.1) !important;
      }
    }
  }
}
</style>
