<script setup>
const props = defineProps({
    title: {
        type: String,
    },
    url: {
        type: String,
    },
});
</script>

<template>
    <div class="icon_legend">
        <img :src="url" alt="" />
        <div class="label">{{ title }}</div>
    </div>
</template>

<style lang="scss" scoped>
.icon_legend {
    width: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // color: #000;
    img {
        width: 20px;
        margin-bottom: 5px;
    }
    .label {
        width: 80px;
        text-align: center;
    }
}
</style>
