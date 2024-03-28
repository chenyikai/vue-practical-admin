<script setup>
import { ref } from "vue";
import useCrud from "@/hooks/useCrud.js";
import MapBox from "@/components/Mapbox/index.vue";
import PageButton from "package/Button/src/index.vue";
import RecordCard from "./record/index.vue";
import Mapbox from "plugins/composition/mapbox.js";
defineOptions({
  name: "IndexPage",
});

const visible = ref(true);
const { listQuery, handleFilter, handelResetSearchForm } = useCrud();

function onSearch() {
  handleFilter();
}

function onResize(timeout) {
  setTimeout(() => {
    Mapbox.getMap().resize();
  }, timeout);
}
</script>

<template>
  <section class="index-page-container">
    <header class="index-page-container-header">
      <el-form
        ref="searchForm"
        :model="listQuery"
        :inline="true"
        label-suffix=":">
        <el-form-item label="养殖证编号" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人类别" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请类型" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请单位" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人姓名" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
        <el-form-item label="申请人电话" prop="menuName">
          <el-input
            v-model="listQuery.menuName"
            placeholder="请输入养殖证编号"
            clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="button-group">
        <page-button class="btn" type="create" />
        <page-button class="btn" type="delete" />
        <page-button class="btn" type="download" />
        <page-button class="btn" type="export" />
        <page-button class="btn" type="import" />
        <page-button class="btn" type="search" @click.stop="onSearch" />
        <page-button
          class="btn"
          type="reset"
          @click.prevent="handelResetSearchForm" />
      </div>
    </header>
    <main class="index-page-container-main">
      <vertical-stretch-box
        left-width="50%"
        :visible="visible"
        @resize="onResize">
        <template #left>
          <record-card v-model="visible" @update:modelValue="onResize" />
        </template>
        <template #right>
          <map-box ref="map" />
        </template>
      </vertical-stretch-box>
    </main>
  </section>
</template>

<style lang="scss" scoped>
@import "src/styles/variables";
.index-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  &-header {
    display: flex;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
    @include container();
    .button-group {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
      gap: 10px;
      flex-shrink: 0;
      width: 240px;
      height: 100%;
      .btn {
        margin: 0;
      }
    }
  }
  &-main {
    width: 100%;
    flex: 1;
    overflow: hidden;
  }
}
</style>
