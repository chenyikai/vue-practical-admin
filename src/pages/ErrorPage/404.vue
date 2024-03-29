<template>
  <div class="page-not-found">
    <div class="content">
      <div class="title-en">404 THE PAGE NOT FOUND</div>
      <div class="title-cn">
        你好像迷失在一个永恒的黑洞里。让我们帮你出去，带你回家。
      </div>
      <div class="button-control-group">
        <el-button size="large" type="success" @click="handleResetCacheData">
          清空缓存
        </el-button>
        <el-button size="large" type="primary" @click="handleNavigatorToWel">
          返回首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNotFound",
  data() {
    return {};
  },
  methods: {
    handleResetCacheData() {},
    handleNavigatorToWel() {},
  },
};
</script>

<style lang="scss">
.page-not-found {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #e3f2fd;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/images/404.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: auto;
  animation: background-liner-move 1s ease-in-out infinite alternate-reverse;
  .content {
    text-align: center;
    margin-top: -150px;
    .title-en {
      font-family: ZhanKuIiterature;
      font-weight: bold;
      font-size: 40px;
      color: #409eff;
      text-shadow: 0px 0px 10px #ffffff;
    }
    .title-cn {
      font-family: ZhanKuIiterature;
      font-size: 20px;
      margin-top: 20px;
      color: #333333;
      text-shadow: 0px 0px 5px #aaaaaa;
    }
    .button-control-group {
      margin-top: 120px;
      margin-bottom: 50px;
      .el-button {
        border-radius: 0;
        width: 150px;
        + .el-button {
          margin-left: 50px;
        }
      }
    }
  }
}

@keyframes background-liner-move {
  from {
    background-position-y: 98%;
  }

  to {
    background-position-y: 95%;
  }
}
</style>
