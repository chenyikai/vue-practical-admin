<template>
  <div>
    <div class="alarm-search">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="内容">
              <el-input
                v-model="form.context"
                placeholder="请输入"
                clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报警类型">
              <el-select
                v-model="form.alarmType"
                clearable
                placeholder="请选择报警类型">
                <el-option
                  v-for="(item, index) in alarmType"
                  :key="index"
                  :label="item.description"
                  :value="item.sort"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="13" style="margin-right: 10px">
            <el-form-item label="统计区间">
              <el-date-picker
                v-model="form.doingTime"
                type="datetimerange"
                range-separator="至"
                value-format="yyyy-MM-dd hh:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="warning" @click="reset"> 重置 </el-button>
              <el-button type="primary" @click="getAlarmList"> 查询 </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider> </el-divider>
    <div class="alarm-content">
      <el-tabs tab-position="left" style="height: 350px">
        <el-tab-pane
          v-for="item in alarmList"
          :key="item.id"
          lazy
          :label="item.shipName">
          <div class="info-item">
            <div class="info-item-label">时间:</div>
            <div class="info-item-content">
              {{ item.doingTime }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">内容:</div>
            <div class="info-item-content">
              {{ item.context }}
            </div>
          </div>
          <div class="info-item">
            <div class="info-item-label">类型:</div>
            <div class="info-item-content">
              {{ handleType(item.alarmType) }}
            </div>
          </div>
          <div v-if="item.pic" class="info-item">
            <div class="info-item-label">图片：</div>
            <el-image
              style="width: 100px; height: 100px"
              :src="item.pic"
              :preview-src-list="[item.pic]">
            </el-image>
          </div>
          <div class="info-item">
            <div class="info-item-label">状态:</div>
            <div class="info-item-content">
              {{ handleStatus(item.status) }}
            </div>
          </div>
          <div
            class="info-item"
            style="display: flex; position: relative; align-items: center">
            <div class="info-item-label" style="width: 60px">批注：</div>
            <el-input
              ref="textarea"
              type="textarea"
              :rows="2"
              placeholder="请输入批注"
              style="width: 400px"
              v-model="item.content">
            </el-input>
            <el-button
              v-if="item.status != '1'"
              style="margin-left: 20px; height: 30px"
              type="success"
              @click="handleCheck(item)"
              >确认处理</el-button
            >
            <el-button
              style="height: 30px"
              v-if="item.status != '1'"
              type="warning"
              @click="handleNext(item)"
              >稍后处理</el-button
            >
            <div class="link">
              <div
                class="link-item"
                v-for="i in linkArr"
                :key="i"
                @click="handleLink(i, item)">
                {{ i }}
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
const interval = 1000 * 15;
import { getDictData } from "@/util/util.js";
import { getAlarmList } from "@/api/alarm";
import { getptReceivedMessageDealMessage } from "@/api/message-center/index.js";

export default {
  name: "ai",
  data() {
    return {
      form: {
        doingTime: [],
      },
      alarmList: [],
      alarmType: [],
      timer: null,
      textarea: "",
      linkArr: ["误报", "已联系驾驶台", "已核实"],
    };
  },

  methods: {
    handleLink(i, item) {
      let Index = this.alarmList.findIndex((ele) => ele.id == item.id);
      console.log(Index, "index");
      // this.alarmList[Index].content = i;
      this.$set(
        this.alarmList[Index],
        "content",
        this.alarmList[Index].content
          ? this.alarmList[Index].content + " " + i
          : i
      );
      console.log(this.alarmList, "alarmList");
    },
    // 获取预警列表
    getAlarmList() {
      getAlarmList({
        ...this.form,
        doingTimeBegin: this.form.doingTime[0] || "",
        doingTimeEnd: this.form.doingTime[1] || "",
        doingTime: undefined,
      }).then(({ data }) => {
        if (data.data.list.length) {
          this.alarmTypeNumber = data.data.list.length;
        }
        this.alarmList = data.data.list;
      });
    },
    // 选择预警类型
    handleType(type) {
      return this.alarmType[type - 1]?.description;
    },
    handleStatus(status) {
      switch (status) {
        case "0":
          return "未处理";
        case "1":
          return "已处理";
        case "2":
          return "处理中";
        default:
          break;
      }
    },
    // 重置
    reset() {
      this.form = {
        doingTime: [],
      };
    },
    // 定时任务
    timeTask() {
      this.timer = setInterval(() => {
        this.getAlarmList();
      }, interval);
    },
    // 清除定时任务
    clearTask() {
      this.timer && clearInterval(this.timer);
      this.timer = null;
    },
    // 确认处理
    handleCheck(value) {
      console.log(value, "value ");
      let obj = {
        id: value.id,
        content: value.content,
        status: "1",
      };
      getptReceivedMessageDealMessage(obj).then(({ data }) => {
        if (data.code == 200) {
          this.$message.success(`${data.msg}`);
          this.getAlarmList();
        }
      });
    },
    // 稍后处理
    handleNext(value) {
      let obj = {
        id: value.id,
        content: value.content,
        status: "0",
      };
      getptReceivedMessageDealMessage(obj).then(({ data }) => {
        if (data.code == 200) {
          this.$message.success(`${data.msg}`);
        }
      });
    },
  },

  created() {
    this.alarmType = getDictData("alarm_type");
    this.getAlarmList();
    this.timeTask();
  },
};
</script>

<style scoped lang="scss">
.alarm-search {
  width: 100%;
  height: 100px;
}
.alarm-content {
  flex: 1;
  overflow: auto;
  display: flex;
}
.info-item {
  display: flex;
  margin-left: 20px;
  margin-bottom: 15px;
  .info-item-label {
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
    width: 50px;
  }
  .info-item-content {
    font-size: 14px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #8f8f8f;
  }
}
::v-deep .el-tabs--left .el-tabs__item.is-left {
  text-align: center;
}
::v-deep .el-page-header__content {
  font-size: 15px;
}
::v-deep .el-range-editor--small .el-range-separator {
  font-size: 11px;
}
::v-deep .el-tabs__content {
  overflow: visible;
}
.link {
  position: absolute;
  bottom: -34px;
  right: -50px;
  width: 100%;
  display: flex;
  .link-item {
    margin-right: 10px;
    cursor: pointer;
    background-color: #eee;
    border-radius: 10px;
    padding: 5px;
    &:hover {
      background-color: skyblue;
      color: #fff;
    }
  }
}
</style>

