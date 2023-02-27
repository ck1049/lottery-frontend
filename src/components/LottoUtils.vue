<script setup>
import { watch } from 'vue';
import { onMounted, getCurrentInstance, ref, reactive } from 'vue';

const currentInstance = getCurrentInstance();
const $axios = currentInstance.appContext.config.globalProperties.$axios;

var allBalls = reactive({ "redBalls": [], "blueBalls": [] });
var singleRandomNumber = reactive({ "redBalls": [], "blueBalls": [] });
var singleRandomNumberCost = ref(2);
var singleRandomNumberWiningRate = ref('');
var multipleRandomNumber = reactive({ "redBalls": [], "blueBalls": [] });
var multipleRandomNumberCost = ref(2);
var multipleRandomNumberWiningRate = ref('');
var selfNumber = reactive({ "redBalls": [], "blueBalls": [] });
var selfNumberCost = ref(2);
var selfNumberWiningRate = ref('');
var multipleType = ref("");

const allRedBallsSize = ref(35);
const allBlueBallsSize = ref(12);

const randomApi = "/lotto/randomNumber/";
const randomWinRateApi = "/lotto/winingRateByMultipleType/";
const randomCostApi = "/lotto/costCalculationByMultipleType/";

const getRandomNumber = multipleType => $axios.get(randomApi + (multipleType || ''));
const getRandomNumberWinRate = multipleType => $axios.get(randomWinRateApi + (multipleType || '5+2'));
const getRandomNumberCost = multipleType => $axios.get(randomCostApi + (multipleType || '5+2'));

onMounted(() => {
    for (let i = 1; i <= allRedBallsSize.value; i++) {
        allBalls.redBalls.push(i < 10 ? "0" + i : "" + i);
    }
    for (let i = 1; i <= allBlueBallsSize.value; i++) {
        allBalls.blueBalls.push(i < 10 ? "0" + i : "" + i);
    }
});
const getSingleRandomNumber = () => {
    getRandomNumber().then(response => {
        singleRandomNumber.redBalls = response.redBalls;
        singleRandomNumber.blueBalls = response.blueBalls;
    }).catch(err => console.log(err));
    getRandomNumberWinRate().then(response => {
        singleRandomNumberWiningRate.value = response.fraction;
    }).catch(err => console.log(err));
}

watch(multipleType, (newValue, oldValue) => {
    if (newValue == '') {
        multipleRandomNumber.redBalls = [];
        multipleRandomNumber.blueBalls = [];
    }
    if (newValue.indexOf("+") > 0) {
        let typeArr = newValue.split("+");
        if (parseInt(typeArr[0]) >= 5 && parseInt(typeArr[0]) <= 35 && parseInt(typeArr[1]) >= 2 && parseInt(typeArr[1]) <= 12) {
            getRandomNumber(newValue).then(response => {
                multipleRandomNumber.redBalls = response.redBalls;
                multipleRandomNumber.blueBalls = response.blueBalls;
            }).catch(err => console.log(err));
            getRandomNumberWinRate(newValue).then(response => {
                multipleRandomNumberWiningRate.value = response.fraction;
            }).catch(err => console.log(err));
            getRandomNumberCost(newValue).then(response => {
                multipleRandomNumberCost.value = response;
            }).catch(err => console.log(err));
        }
    }
});

</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>体彩大乐透实用工具</el-header>
            <el-main style="padding: 0;">
                <el-row style="margin-bottom: 5vh;">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" @click="getSingleRandomNumber" width="100%">机选单式</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="4" :lg="4">
                        <el-button type="danger" circle v-for="(item, index) in singleRandomNumber.redBalls" :key="index">
                            {{ item }}
                        </el-button>
                    </el-col>
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" circle v-for="(item, index) in singleRandomNumber.blueBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                    <el-col v-if="!!singleRandomNumberWiningRate" :xs="8" :sm="8" :md="16" :lg="16"
                        style="text-align: left;vertical-align: auto;padding-top: 4px;">
                        <span style="margin-right: 2vw;vertical-align: auto;">需花费:{{ singleRandomNumberCost }}元</span>
                        <span>中奖率:{{ singleRandomNumberWiningRate }}</span>
                    </el-col>
                </el-row>

                <el-row style="margin-bottom: 2vh;">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" width="100%">机选复式</el-button>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="4" :lg="4">
                        <el-input v-model="multipleType" placeholder="Please input multiple type." clearable style="width: 90%;"/>
                    </el-col>
                    <el-col v-if="!!multipleRandomNumberWiningRate" :xs="8" :sm="8" :md="16" :lg="16"
                        style="text-align: left;vertical-align: auto;padding-top: 4px;">
                        <span style="margin-right: 2vw;vertical-align: auto;">需花费:{{ multipleRandomNumberCost }}元</span>
                        <span>中奖率:{{ multipleRandomNumberWiningRate }}</span>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="danger" circle v-for="(item, index) in multipleRandomNumber.redBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 5vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="primary" circle v-for="(item, index) in multipleRandomNumber.blueBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>

                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw;">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" width="100%">自选号码</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="8" :lg="8">
                        <el-input v-model="multipleType" placeholder="Please choose your number." disabled style="width: 90%;"/>
                    </el-col>
                    <el-col v-if="!!selfNumberWiningRate" :xs="12" :sm="12" :md="14" :lg="14"
                        style="text-align: left;vertical-align: auto;padding-top: 4px;">
                        <span style="margin-right: 2vw;vertical-align: auto;">需花费:{{ selfNumberCost }}元</span>
                        <span>中奖率:{{ selfNumberWiningRate }}</span>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="danger" circle v-for="(item, index) in allBalls.redBalls.slice(0, 12)"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="danger" circle v-for="(item, index) in allBalls.redBalls.slice(12, 24)"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="danger" circle v-for="(item, index) in allBalls.redBalls.slice(24)"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
                <el-row style="text-align: left;margin-bottom: 5vh;padding-left: 1vw;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="primary" circle v-for="(item, index) in allBalls.blueBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
            </el-main>
            <el-footer style="padding: 0;margin-top: 3px;">
            </el-footer>
        </el-container>
    </div>
</template>
<style scoped></style>