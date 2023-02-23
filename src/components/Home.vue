<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Document, Menu as IconMenu, Location, Setting, } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();

const defaultActive = ref("/lotto/1");
onMounted(() => {
    router.push(defaultActive.value);
});

const handleOpen = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
    console.log(key, keyPath)
}
const handleSizeChange = (size) => {

}
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>

            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu v-model:default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :router="true">
                        <el-sub-menu index="1">
                            <template #title>
                                <!-- <el-icon>
                                    <location />
                                </el-icon> -->
                                <span>体彩大乐透</span>
                            </template>
                            <el-menu-item index="/lotto/1">开奖信息</el-menu-item>
                            <el-menu-item index="1-2">实用工具</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="2">
                            <template #title>
                                <!-- <el-icon>
                                    <location />
                                </el-icon> -->
                                <span>福彩双色球</span>
                            </template>
                            <el-menu-item index="/twoColorBalls/1">开奖信息</el-menu-item>
                            <el-menu-item index="2-2">实用工具</el-menu-item>
                        </el-sub-menu>
                        <el-menu-item index="4">
                            <el-icon>
                                <setting />
                            </el-icon>
                            <span>settings</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
  
<style scoped></style>
  