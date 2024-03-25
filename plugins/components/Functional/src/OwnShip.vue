<script>
import { getTeamAndShipList } from "@/api/shipTeam";
import DataTable from "./DataTable.vue";
import MapboxShip from "@/plugins/composition/mapbox-ship";
import { shipInfoDelete } from "@/api/ship";

export default {
  name: "OwnShip",
  components: { DataTable },
  data() {
    return {
      shipList: [],
    };
  },
  created() {
    this.getTeamAndShipList();
  },
  methods: {
    handlePosition(rowData) {
      MapboxShip.setFocus(rowData.mmsi);
    },
    handleDelete(rowData) {
      this.$confirm(`是否确认删除：${rowData.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        shipInfoDelete(rowData.id).then(() => {
          MapboxShip.refresh();
          this.$message.success("删除成功");
          this.getTeamAndShipList();
        });
      });
    },
    getTeamAndShipList() {
      getTeamAndShipList().then(({ data }) => {
        this.shipList = data.data;
      });
    },
    getData(val) {
      return val.map((item) => {
        return {
          ...item,
          name: item.shipName || item.cnname || item.enname || item.mmsi,
        };
      });
    },
  },
};
</script>

<template>
  <el-tabs tab-position="left">
    <el-tab-pane v-for="item in shipList" :key="item.id" :label="item.name">
      <data-table :data="getData(item.shipInfos)">
        <template slot-scope="{ row }">
          <AvueFormButton
            type="success"
            icon="el-icon-position"
            @click="handlePosition(row)"
            >定位</AvueFormButton
          >
          <AvueFormButton
            type="delete"
            icon="el-icon-delete"
            @click="handleDelete(row)"
            >删除</AvueFormButton
          >
        </template>
      </data-table>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped lang="scss"></style>
