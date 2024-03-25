<template>
  <div class="setup-box">
    <el-form :model="form" label-width="150px" :rules="rules">
      <el-row>
        <el-col :span="11">
          <el-form-item label="初始经度" prop="lng">
            <el-input-number
              style="width: 100%"
              v-model="form.lng"
              :min="-179.99"
              :max="179.99"
              :precision="6"
              :style="{ width: '200px' }" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="初始纬度" prop="lat">
            <el-input-number
              style="width: 100%"
              v-model="form.lat"
              :min="-89.99"
              :max="89.99"
              :precision="6"
              :style="{ width: '200px', 'text-align': 'center' }" />
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="默认层级">
            <el-input
              v-model="form.mrcj"
              :style="{ width: '200px' }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="船舶">
            <el-radio-group v-model="form.cb">
              <el-radio :label="1">显示全部船舶</el-radio>
              <el-radio :label="2">显示内部船舶</el-radio>
              <el-radio :label="3">显示外部船舶</el-radio>
              <el-radio :label="4">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="默认图源">
            <el-radio-group v-model="form.mrty">
              <el-radio :label="5">海陆图</el-radio>
              <el-radio :label="2">海图</el-radio>
              <el-radio :label="3">卫星图</el-radio>
              <el-radio :label="4">地图</el-radio>
              <el-radio :label="6">影像图</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="11">-->
        <!--          <el-form-item label="是否启动渔场图">-->
        <!--            <el-radio-group v-model="form.qdyct">-->
        <!--              <el-radio :label="1">显示</el-radio>-->
        <!--              <el-radio :label="2">不显示</el-radio>-->
        <!--            </el-radio-group>-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
        <el-col :span="11">
          <el-form-item label="是否显示世界港口">
            <el-radio-group v-model="form.xssjgk">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否显示标绘">
            <el-radio-group v-model="form.biaohui">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="显示航行告警通告">
            <el-radio-group v-model="form.xsgjtg">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="显示锚地">
            <el-radio-group v-model="form.xsmd">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="显示航线">
            <el-radio-group v-model="form.xshx">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="11">
          <el-form-item label="显示停靠区域">
            <el-radio-group v-model="form.xstkqy">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="是否显示电子围栏">
            <el-radio-group v-model="form.xsdzwl">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button type="primary" @click="updateConfig">确认</el-button>
    </div>
  </div>
</template>

<script>
import { updateConfig, getDetailOne } from "@/api/sys/setup.js";

export default {
  name: "setup",
  data() {
    return {
      form: {},
      rules: {
        lat: [
          { required: true, message: "请输入数字", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              console.log(value, 1111);
              if (
                value !== null &&
                (isNaN(value) || value < -90 || value > 90)
              ) {
                console.log(2222);

                callback(new Error("请输入-90到90之间的数字"));
              } else {
                console.log(33333);
                callback();
              }
            },
            trigger: "blur",
          },
        ],
        lng: [
          { required: true, message: "请输入数字", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (
                value !== null &&
                (isNaN(value) || value < -180 || value > 180)
              ) {
                callback(new Error("请输入-180到180之间的数字"));
              } else {
                callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    "form.mrty": {
      deep: true,
      handler(val) {
        this.$store.commit("SET_INIT_LAYER", val);
      },
    },
  },
  methods: {
    // 获取详情的第一条数据
    getDetailOne() {
      getDetailOne().then(({ data }) => {
        this.form = data.data;
        delete this.form.createDate;
        delete this.form.createUser;
        delete this.form.updateDate;
        delete this.form.updateUser;
        delete this.form.isDelete;
      });
    },
    // 修改
    updateConfig() {
      updateConfig(this.form)
        .then(({ data }) => {
          if (data.code == 200) {
            this.$message.success(data.msg);
          } else {
            this.$message(data.msg);
          }
        })
        .finally(() => {
          window.location.reload();
        });
    },
  },
  created() {
    // this.getConfigDetail();
    this.getDetailOne();
  },
};
</script>

<style scoped lang="scss">
.setup-box {
  width: 877px;
  //height: 520px;
  .el-row {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .btn {
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>
