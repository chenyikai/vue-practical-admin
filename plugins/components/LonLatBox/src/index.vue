<script>
import CustomColorPicker from "@/plugins/components/CustomColorPicker/index.vue";
import { cloneDeep } from "lodash";
import LonLatCard from "./lonLatCard.vue";
import { MapboxPlotClass } from "@/plugins/composition/mapbox-plot";
import { MapboxToolsClass } from "@/plugins/composition/mapbox-tools";
import MapboxDraw, { MapboxDrawClass } from "@/plugins/composition/mapbox-draw";
import {
  circleFormConfig,
  lineFormConfig,
  pointFormConfig,
  polygonFormConfig,
  fenceFormConfig,
  stopFormConfig,
  playBackFormConfig,
  routeFormConfig,
} from "./config";
import { validatenull } from "@/util/validate";
import { circle } from "@turf/turf";

export default {
  name: "LonLatBox",
  components: { LonLatCard, CustomColorPicker },
  provide() {
    return {
      plotType: this.plotType,
    };
  },
  data() {
    return {
      visible: false,
      featureData: {},
      radius: undefined,
      form: {},
      plotType: undefined,
      lonLatList: [],
      teamList: [],
    };
  },
  computed: {
    formConfig() {
      const map = {
        [MapboxPlotClass.POINT]: pointFormConfig,
        [MapboxPlotClass.LINE]: lineFormConfig,
        [MapboxPlotClass.POLYGON]: polygonFormConfig,
        [MapboxPlotClass.CIRCLE]: circleFormConfig,
        [MapboxToolsClass.FENCE]: fenceFormConfig,
        [MapboxToolsClass.STOP]: stopFormConfig,
        [MapboxToolsClass.PLAY_BACK]: playBackFormConfig,
        [MapboxToolsClass.ROUTE]: routeFormConfig,
      };
      return map[this.plotType];
    },
  },
  methods: {
    validatenull,
    setTeam(val) {
      this.teamList = val;
    },
    handleOpened() {
      const docs = document.body.getElementsByClassName("el-drawer__wrapper");
      docs.forEach((item) => {
        if (item.className.indexOf("avue") === -1) {
          item.style.pointerEvents = "none";
        }
      });
    },
    handleConfirm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$emit("confirm", this.featureData);
          this.handleClose();
        }
      });
    },
    handlePosition() {
      this.$emit("position", this.featureData);
    },
    handleCancel() {
      this.handleClose();
      this.$emit("cancel", this.featureData);
    },
    open(data) {
      const { properties } = cloneDeep(data);
      this.featureData = cloneDeep(data);
      this.plotType = this.featureData.properties["graphical-type"];
      this.setLonLat(this.featureData);
      this.form = properties;
      this.visible = true;
    },
    close() {
      this.featureData = {};
      this.plotType = null;
      this.form = {};
      this.visible = false;
    },
    getLonLatFuncByType(type) {
      const self = this;
      const object = {
        [MapboxPlotClass.POINT]: {
          set(val) {
            self.lonLatList = [val];
          },
          get() {
            return self.lonLatList[0];
          },
        },
        [MapboxPlotClass.LINE]: {
          set(val) {
            self.lonLatList = val;
          },
          get() {
            return self.lonLatList;
          },
        },
        [MapboxPlotClass.POLYGON]: {
          set(val) {
            // 去除面数据的最后一个重复点
            val[0].pop();
            self.lonLatList = val[0];
          },
          get() {
            // 组建mapbox可以接受的面格式GeoJSON
            const first = self.lonLatList[0];
            return [[...self.lonLatList, first]];
          },
        },
        [MapboxPlotClass.CIRCLE]: {
          set(val) {
            self.lonLatList = [val["center"]];
            self.radius = val["radius"];
          },
          get() {
            const first = self.lonLatList[0];
            return [[...self.lonLatList, first]];
          },
        },
        [MapboxToolsClass.FENCE]: {
          set(val) {
            // 去除面数据的最后一个重复点
            val[0].pop();
            self.lonLatList = val[0];
          },
          get() {
            // 组建mapbox可以接受的面格式GeoJSON
            const first = self.lonLatList[0];
            return [[...self.lonLatList, first]];
          },
        },
        [MapboxToolsClass.STOP]: {
          set(val) {
            // 去除面数据的最后一个重复点
            val[0].pop();
            self.lonLatList = val[0];
          },
          get() {
            // 组建mapbox可以接受的面格式GeoJSON
            const first = self.lonLatList[0];
            return [[...self.lonLatList, first]];
          },
        },
        [MapboxToolsClass.PLAY_BACK]: {
          set(val) {
            // 去除面数据的最后一个重复点
            val[0].pop();
            self.lonLatList = val[0];
          },
          get() {
            // 组建mapbox可以接受的面格式GeoJSON
            const first = self.lonLatList[0];
            return [[...self.lonLatList, first]];
          },
        },
        [MapboxToolsClass.ROUTE]: {
          set(val) {
            self.lonLatList = val;
          },
          get() {
            return self.lonLatList;
          },
        },
      };
      return object[type];
    },
    setLonLat(featureData) {
      const { set } = this.getLonLatFuncByType(this.plotType);
      if (this.plotType === MapboxPlotClass.CIRCLE) {
        set(featureData.properties);
      } else {
        const coordinates = featureData.geometry.coordinates;
        set(coordinates);
      }
    },
    getLonLat() {
      const { get } = this.getLonLatFuncByType(this.plotType);
      return get();
    },
    emit() {
      this.$set(this.featureData, "properties", this.form);
      this.$set(this.featureData.geometry, "coordinates", this.getLonLat());
      this.$emit("change", this.featureData);
    },
    handleRadiusChange(val) {
      const center = this.lonLatList;
      const radius = val;
      const options = {
        steps: 10,
        units: "kilometers",
        properties: this.form,
      };
      const _circle = circle(center, radius, options);
      this.featureData = { ..._circle, id: this.featureData.id };
    },
    handleClose() {
      this.visible = false;
      const docs = document.body.getElementsByClassName("el-drawer__wrapper");
      docs.forEach((item) => {
        if (item.className.indexOf("avue") === -1) {
          item.style.pointerEvents = "null";
        }
      });
      MapboxDraw.changeMode(MapboxDrawClass.SIMPLE_SELECT);
    },
    handleAddTeam() {
      this.$prompt("请输入分组名称", "添加新分组", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: (val) => {
          return validatenull(val) ? "分组名称不能为空" : true;
        },
      }).then(({ value }) => {
        this.$emit("addTeam", {
          type: this.plotType,
          val: value,
        });
      });
    },
  },
};
</script>

<template>
  <el-drawer
    custom-class="lon-lat-drawer"
    title="标绘编辑"
    size="400px"
    :visible.sync="visible"
    direction="rtl"
    append-to-body
    :modal-append-to-body="false"
    :wrapperClosable="false"
    :modal="false"
    :before-close="handleClose"
    @opened="handleOpened">
    <template slot="title">
      <div class="title-layout">
        <span class="label">图形编辑</span>
        <div class="btn-layout">
          <AvueFormButton
            type="primary"
            circle
            @click="handlePosition"
            icon="el-icon-position"
            >定位</AvueFormButton
          >
          <AvueFormButton
            type="primary"
            circle
            @click="handleConfirm"
            icon="el-icon-check"
            >保存</AvueFormButton
          >
          <AvueFormButton
            type="danger"
            @click="handleCancel"
            icon="el-icon-close"
            circle
            >关闭</AvueFormButton
          >
        </div>
      </div>
    </template>
    <div class="lon-lat-box">
      <el-form class="lon-lat-form" ref="form" :model="form" label-width="80px">
        <el-row>
          <div class="content">
            <el-col
              v-for="item in formConfig"
              :key="item.prop"
              :span="item.span">
              <el-form-item
                :label="item.label"
                :rules="item.rules"
                :prop="item.prop">
                <template
                  v-if="validatenull(item.type) || item.type === 'input'">
                  <el-input
                    v-bind="item"
                    v-model="form[item.prop]"
                    @blur="emit" />
                </template>
                <template v-else-if="item.type === 'select'">
                  <el-select
                    v-model="form[item.prop]"
                    v-bind="item"
                    @change="emit">
                    <el-option
                      v-for="ele in item.dicData"
                      :key="ele.value"
                      :value="ele.value"
                      :label="ele.label" />
                  </el-select>
                </template>
                <template v-else-if="item.type === 'team'">
                  <div class="team-select-layout">
                    <el-select
                      class="team-select"
                      v-model="form[item.prop]"
                      v-bind="item"
                      @change="emit">
                      <el-option
                        v-for="ele in teamList"
                        :key="ele.value"
                        :value="ele.value"
                        :label="ele.label" />
                    </el-select>
                    <el-button
                      icon="el-icon-plus"
                      circle
                      @click="handleAddTeam()" />
                  </div>
                </template>
                <template v-else-if="item.type === 'color'">
                  <custom-color-picker
                    v-model="form[item.prop]"
                    @change="emit" />
                </template>
                <template v-else-if="item.type === 'number'">
                  <el-input-number
                    v-bind="item"
                    v-model="form[item.prop]"
                    controls-position="right"
                    @blur="emit" />
                </template>
                <template v-else-if="item.type === 'radio'">
                  <el-radio-group v-model="form[item.prop]" @change="emit">
                    <el-radio
                      v-for="ele in item.dicData"
                      :key="ele.value"
                      :label="ele.value"
                      >{{ ele.label }}</el-radio
                    >
                  </el-radio-group>
                </template>
                <template v-else-if="item.type === 'datetime'">
                  <el-date-picker
                    v-model="form[item.prop]"
                    type="datetime"
                    placeholder="请选择日期时间"
                    :value-format="item['value-format']"
                    @change="emit" />
                </template>
                <template v-else-if="item.type === 'tips'">
                  <span class="tips">{{ item.content }}</span>
                </template>
                <template v-else-if="item.type === 'textarea'">
                  <el-input
                    type="textarea"
                    :rows="item.rows || 2"
                    placeholder="请输入内容"
                    @blur="emit"
                    v-model="form[item.prop]">
                  </el-input>
                </template>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item class="form-lon-lat">
              <lon-lat-card
                v-model="lonLatList"
                @change="emit"
                :type="plotType"
                :radius="radius"
                @radius-change="handleRadiusChange" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.lon-lat-box {
  width: 400px;
  background-color: transparent;
  .lon-lat-form {
    .content {
      padding-right: 15px;
    }
    .el-form-item__label {
      color: #000;
      //font-weight: bold;
    }
    .el-form-item__content {
      .el-select {
        width: 100%;
      }
      .el-input-number {
        width: 100%;
      }
      .el-date-editor {
        width: 100%;
      }
      .team-select-layout {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        .team-select {
          flex: 1;
        }
      }
    }
    .form-lon-lat {
      width: 100%;
      .el-form-item__content {
        width: 100%;
        margin-left: 0 !important;
        padding: 10px;
      }
    }
    .form-button-group {
      .el-form-item__content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 0 !important;
      }
    }
  }
}
</style>
