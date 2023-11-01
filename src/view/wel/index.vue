<template>
  <div class="wel-view">
    <AochenContainer class="wel-view">
      <img :src="`${BASE_URL}images/welcome.jpg`" />
    </AochenContainer>
  </div>
</template>

<script>
export default {
  name: "WelView",
};
</script>

<style lang="scss">
.wel-view {
  img {
    width: 100%;
  }
}
</style>
