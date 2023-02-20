<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const toLotto = () => {
    router.push("/lotto/1");
};
const toTwoColorBall = () => {
    router.push("/twoColorBall/1");
};
</script>
<template>
    <div>
        <el-link type="primary" href="javascript:toLotto" @click="toLotto">大乐透</el-link>
    </div>
    <div>
        <el-link type="primary" href="javascript:void(0)" @click="toTwoColorBall">双色球</el-link>
    </div>
    <router-view></router-view>
</template>
<style scoped>
</style>