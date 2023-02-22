<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const toLotto = () => {
    console.log(router);
    router.push("/lotto/1");
};
const toTwoColorBall = () => {
    router.push("/twoColorBall/1");
};
</script>
<template>
    <el-row>
        <el-col :span="2" :offset="10">
            <el-link type="primary" href="javascript:void(0)" @click="toLotto">大乐透</el-link>
        </el-col>
        <el-col :span="2">
            <el-link type="primary" href="javascript:void(0)" @click="toTwoColorBall">双色球</el-link>
        </el-col>
    </el-row>
    <router-view></router-view>
</template>
<style scoped></style>