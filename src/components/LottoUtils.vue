<script setup>
import { watch } from "vue";
import { onMounted, getCurrentInstance, ref, reactive } from "vue";

const currentInstance = getCurrentInstance();
const $axios = currentInstance.appContext.config.globalProperties.$axios;

var allBalls = reactive({ redBalls: [], blueBalls: [] }); // 大乐透所有号码球
var singleRandomNumber = reactive({ redBalls: [], blueBalls: [] }); // 机选单式号码球
var singleRandomNumberAdditional = ref(0); // 机选单式追加倍数
var singleRandomNumberCost = ref(2); // 机选单式成本
var singleRandomNumberWiningRate = reactive({ fraction: "", rate: "" }); // 机选单式中奖率
var multipleRandomNumber = reactive({ redBalls: [], blueBalls: [] }); // 机选复式号码球
var multipleRandomNumberAdditional = ref(0); // 机选复式追加倍数
var multipleRandomNumberCost = ref(2); // 机选复式成本
var multipleRandomNumberWiningRate = reactive({ fraction: "", rate: "" }); // 机选复式中奖率
var selfNumber = reactive({ redBalls: [], blueBalls: [] }); // 自选号码球
var selfNumberAdditional = ref(0); // 自选号码追加倍数
var selfNumberCost = ref(2); // 自选号码成本
var selfNumberWiningRate = reactive({ fraction: "", rate: "" }); // 自选号码中奖率
var selfNumberStr = ref(""); // 自选号码拼接字符串
var multipleType = ref(""); // 机选复式类型

const allRedBallsSize = ref(35);
const allBlueBallsSize = ref(12);

const randomApi = "/lotto/randomNumber/";
const randomWinRateApi = "/lotto/winingRateByMultipleType/";
const randomCostApi = "/lotto/costCalculationByMultipleType/";
const selfNumberWinRateApi = "/lotto/winingRateByNumbers/";
const selfNumberCostApi = "/lotto/costCalculationByNumber/";

const getRandomNumber = (multipleType) =>
    $axios.get(randomApi + (multipleType || ""));
const getRandomNumberWinRate = (multipleType) =>
    $axios.get(randomWinRateApi + (multipleType || "5+2"));
const getRandomNumberCost = (multipleType, additional) =>
    $axios.get(randomCostApi + (multipleType || "5+2") + "/" + additional);
const getSelfNumberWinRate = (redNumbers, blueNumbers) =>
    $axios.get(selfNumberWinRateApi + redNumbers + "/" + blueNumbers);
const getSelfNumberCost = (redNumbers, blueNumbers, additional) =>
    $axios.get(selfNumberCostApi + redNumbers + "/" + blueNumbers + "/" + additional);

onMounted(() => {
    for (let i = 1; i <= allRedBallsSize.value; i++) {
        allBalls.redBalls.push(i < 10 ? "0" + i : "" + i);
    }
    for (let i = 1; i <= allBlueBallsSize.value; i++) {
        allBalls.blueBalls.push(i < 10 ? "0" + i : "" + i);
    }
});

// 生成单式号码，计算中奖率
const getSingleRandomNumber = () => {
    getRandomNumber()
        .then((response) => {
            singleRandomNumber.redBalls = response.redBalls;
            singleRandomNumber.blueBalls = response.blueBalls;
        })
        .catch((err) => console.log(err));
    getRandomNumberWinRate()
        .then((response) => {
            singleRandomNumberWiningRate.fraction = response.fraction;
            singleRandomNumberWiningRate.rate = response.rate;
        })
        .catch((err) => console.log(err));
    getRandomNumberCost("", singleRandomNumberAdditional).then(response => {
        singleRandomNumberCost.value = response;
    }).catch(err => console.log(err));
};

// 生成复式号码，计算成本、中奖率
watch(multipleType, (newValue, oldValue) => {
    if (newValue == "") {
        multipleRandomNumber.redBalls = [];
        multipleRandomNumber.blueBalls = [];
        multipleRandomNumberWiningRate.value = "";
    }
    if (newValue.indexOf("+") > 0) {
        let typeArr = newValue.split("+");
        if (
            parseInt(typeArr[0]) >= 5 &&
            parseInt(typeArr[0]) <= 35 &&
            parseInt(typeArr[1]) >= 2 &&
            parseInt(typeArr[1]) <= 12
        ) {
            getRandomNumber(newValue)
                .then((response) => {
                    multipleRandomNumber.redBalls = response.redBalls;
                    multipleRandomNumber.blueBalls = response.blueBalls;
                })
                .catch((err) => console.log(err));
            getRandomNumberWinRate(newValue)
                .then((response) => {
                    multipleRandomNumberWiningRate.fraction = response.fraction;
                    multipleRandomNumberWiningRate.rate = response.rate;
                })
                .catch((err) => console.log(err));
            getRandomNumberCost(newValue, multipleRandomNumberAdditional.value)
                .then((response) => multipleRandomNumberCost.value = response)
                .catch((err) => console.log(err));
        }
    }
});

// 自选号码，计算成本、中奖率
watch(selfNumber, (newValue, oldValue) => {
    selfNumberStr.value =
        selfNumber.redBalls.sort().join(" ") +
        " , " +
        selfNumber.blueBalls.sort().join(" ");
    if (
        selfNumber.redBalls.length >= 5 &&
        selfNumber.redBalls.length <= 35 &&
        selfNumber.blueBalls.length >= 2 &&
        selfNumber.blueBalls.length <= 12
    ) {
        getSelfNumberWinRate(
            selfNumber.redBalls.sort().join(","),
            selfNumber.blueBalls.sort().join(",")
        )
            .then((response) => {
                selfNumberWiningRate.fraction = response.fraction;
                selfNumberWiningRate.rate = response.rate;
            })
            .catch((err) => console.log(err));
        getSelfNumberCost(
            selfNumber.redBalls.sort().join(","),
            selfNumber.blueBalls.sort().join(","),
            selfNumberAdditional.value
        )
            .then((response) => (selfNumberCost.value = response))
            .catch((err) => console.log(err));
    }
});
// 监听机选单式追加倍数，从新计算成本
watch(singleRandomNumberAdditional, (newValue, oldValue) => {
    getRandomNumberCost("", newValue)
        .then((response) => singleRandomNumberCost.value = response)
        .catch((err) => console.log(err));
});
// 监听机选复式追加倍数，从新计算成本
watch(multipleRandomNumberAdditional, (newValue, oldValue) => {
    getRandomNumberCost(multipleType.value, newValue)
        .then((response) => multipleRandomNumberCost.value = response)
        .catch((err) => console.log(err));
});
// 监听自选号码追加倍数，从新计算成本
watch(selfNumberAdditional, (newValue, oldValue) => {
    getSelfNumberCost(
        selfNumber.redBalls.sort().join(","),
        selfNumber.blueBalls.sort().join(","),
        newValue
    )
        .then((response) => (selfNumberCost.value = response))
        .catch((err) => console.log(err));
});
</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>体彩大乐透实用工具</el-header>
            <el-main style="padding: 0">
                <el-row style="text-align: left;margin-bottom: 5vh;padding-left: 1vw">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" @click="getSingleRandomNumber" width="100%">机选单式</el-button>
                    </el-col>
                    <el-col :xs="6" :sm="6" :md="4" :lg="4">
                        <el-button type="danger" circle v-for="(item, index) in singleRandomNumber.redBalls" :key="index">
                            {{ item }}
                        </el-button>
                    </el-col>
                    <el-col :xs="2" :sm="2" :md="4" :lg="4">
                        <el-button type="primary" circle v-for="(item, index) in singleRandomNumber.blueBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                    <el-col v-if="!!singleRandomNumberWiningRate.rate" :xs="12" :sm="12" :md="14" :lg="14"
                        style="text-align: left; vertical-align: auto;">
                        <el-input-number v-model="singleRandomNumberAdditional" :min="0" style="margin-right: 2vw;" />
                        <span style="margin-right: 2vw;vertical-align: auto;margin-top: 4px;">需花费:{{ singleRandomNumberCost
                        }}元</span>
                        <span style="margin-top: 4px;">中奖率:{{ singleRandomNumberWiningRate.fraction }}≈{{
                            singleRandomNumberWiningRate.rate
                        }}</span>
                    </el-col>
                </el-row>

                <el-row style="text-align: left;margin-bottom: 2vh;padding-left: 1vw">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" width="100%">机选复式</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="8" :lg="8">
                        <el-input v-model="multipleType" placeholder="Please input multiple type." clearable
                            style="width: 90%" />
                    </el-col>
                    <el-col v-if="!!multipleRandomNumberWiningRate.rate" :xs="12" :sm="12" :md="14" :lg="14"
                        style="text-align: left; vertical-align: auto;">
                        <el-input-number v-model="multipleRandomNumberAdditional" :min="0" style="margin-right: 2vw;" />
                        <span style="margin-right: 2vw;vertical-align: auto;margin-top: 4px;">需花费:{{
                            multipleRandomNumberCost }}元</span>
                        <span style="margin-top: 4px;">中奖率:{{ multipleRandomNumberWiningRate.fraction }}≈{{
                            singleRandomNumberWiningRate.rate
                        }}</span>
                    </el-col>
                </el-row>
                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="danger" circle v-for="(item, index) in multipleRandomNumber.redBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>
                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-col :xs="24" :sm="24" :md="24" :lg="24">
                        <el-button type="primary" circle v-for="(item, index) in multipleRandomNumber.blueBalls"
                            :key="index">{{ item }}</el-button>
                    </el-col>
                </el-row>

                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-col :xs="4" :sm="4" :md="2" :lg="2">
                        <el-button type="primary" width="100%">自选号码</el-button>
                    </el-col>
                    <el-col :xs="8" :sm="8" :md="8" :lg="8">
                        <el-input v-model="selfNumberStr" disabled autosize type="textarea"
                            placeholder="Please choose your number." style="width: 90%" />
                    </el-col>
                    <el-col v-if="!!selfNumberWiningRate.rate" :xs="12" :sm="12" :md="14" :lg="14"
                        style="text-align: left; vertical-align: auto;">
                        <el-input-number v-model="selfNumberAdditional" :min="0" style="margin-right: 2vw;" />
                        <span style="margin-right: 2vw;vertical-align: auto;margin-top: 4px;">需花费:{{ selfNumberCost
                        }}元</span>
                        <span style="margin-top: 4px;">中奖率:{{ selfNumberWiningRate.fraction }}≈{{
                            selfNumberWiningRate.rate
                        }}</span>
                    </el-col>
                </el-row>
                <!-- checkbox -->
                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-checkbox-group v-model="selfNumber.redBalls" size="large" :border="true" fill="#67C23A">
                        <el-checkbox-button v-for="(item, index) in allBalls.redBalls.slice(0, 12)" :key="index"
                            :label="item" class="red-ball" style="margin-right: 0.5vw">
                            {{ item }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-row>
                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-checkbox-group v-model="selfNumber.redBalls" size="large" fill="#67C23A">
                        <el-checkbox-button v-for="(item, index) in allBalls.redBalls.slice(12, 24)" :key="index"
                            :label="item" class="red-ball" style="margin-right: 0.5vw">
                            {{ item }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-row>
                <el-row style="text-align: left; margin-bottom: 2vh; padding-left: 1vw">
                    <el-checkbox-group v-model="selfNumber.redBalls" size="large" fill="#67C23A">
                        <el-checkbox-button v-for="(item, index) in allBalls.redBalls.slice(24)" :key="index" :label="item"
                            class="red-ball" style="margin-right: 0.5vw">
                            {{ item }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-row>
                <el-row style="text-align: left; margin-bottom: 5vh; padding-left: 1vw">
                    <el-checkbox-group v-model="selfNumber.blueBalls" size="large" fill="#67C23A">
                        <el-checkbox-button v-for="(item, index) in allBalls.blueBalls" :key="index" :label="item"
                            class="blue-ball" style="margin-right: 0.5vw">
                            {{ item }}
                        </el-checkbox-button>
                    </el-checkbox-group>
                </el-row>
                <!-- button -->
                <!-- <div>
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
                                                                        :key="index">{{
                                                                            item }}</el-button>
                                                                </el-col>
                                                            </el-row>
                                                            <el-row style="text-align: left;margin-bottom: 5vh;padding-left: 1vw;">
                                                                <el-col :xs="24" :sm="24" :md="24" :lg="24">
                                                                    <el-button type="primary" circle v-for="(item, index) in allBalls.blueBalls" :key="index">{{
                                                                        item
                                                                    }}</el-button>
                                                                </el-col>
                                                            </el-row>
                                                        </div> -->
            </el-main>
            <el-footer style="padding: 0; margin-top: 3px"> </el-footer>
        </el-container>
    </div>
</template>
<style scoped>
::v-deep .el-checkbox-button.red-ball .el-checkbox-button__inner {
    background-color: var(--el-color-danger);
    border-radius: 50%;
    color: white;
    width: 35px;
    height: 33px;
    padding: 9px 8px;
}

::v-deep .el-checkbox-button.blue-ball .el-checkbox-button__inner {
    background-color: var(--el-color-primary);
    border-radius: 50%;
    color: white;
    width: 35px;
    height: 33px;
    padding: 9px 8px;
}
</style>