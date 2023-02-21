<script setup>
import { watch } from 'vue';
import { onMounted, getCurrentInstance, ref, reactive } from 'vue';

const currentInstance = getCurrentInstance();
const $axios = currentInstance.appContext.config.globalProperties.$axios;
const pageInfo = ref('');
const currentPage = ref(1);

const getLottoPageInfo = (api) => {
    $axios({
        method: 'get',
        url: api
    }).then(response => {
        pageInfo.value = response.data;
        console.log(pageInfo);
    }).catch(error => {
        console.log("error===" + error);
    })
}

onMounted(() => {
    let api = "/api/lotto/index/1";
    console.log($axios);
    getLottoPageInfo(api);
});

// const tableRowClassName = params => console.log("params====" + JSON.stringify(params))
const tableRowClassName = ({ row, rowIndex }) => {
    if (rowIndex % 5 == 0) {
        return 'primary-row'
    } else if (rowIndex % 5 == 1) {
        return 'success-row'
    } else if (rowIndex % 5 == 2) {
        return 'warning-row'
    } else if (rowIndex % 5 == 3) {
        return 'danger-row'
    } else {
        return 'info-row'
    }
}

watch(currentPage, (newValue, oldValue) => {
    let api = "/api/lotto/index/" + newValue;
    getLottoPageInfo(api);
});

</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>体彩大乐透开奖信息</el-header>
            <el-main>
                <el-table :data="pageInfo.list" style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="issueNumber" label="期号" width="150" />
                    <el-table-column prop="red1" label="红球" width="100" />
                    <el-table-column prop="red2" label="红球" width="100" />
                    <el-table-column prop="red3" label="红球" width="100" />
                    <el-table-column prop="red4" label="红球" width="100" />
                    <el-table-column prop="red5" label="红球" width="100" />
                    <el-table-column prop="blue1" label="蓝球" width="100" />
                    <el-table-column prop="blue2" label="蓝球" width="100" />
                    <el-table-column prop="awardDate" label="开奖日期" width="180" />
                </el-table>
            </el-main>
            <el-footer>
                <el-pagination background layout="prev, pager, next" :total="pageInfo.total"
                    v-model:current-page="currentPage" />
            </el-footer>
        </el-container>
    </div>
</template>
<style>
.el-table .primary-row {
    --el-table-tr-bg-color: var(--el-color-primary-light-9);
}

.el-table .success-row {
    --el-table-tr-bg-color: var(--el-color-success-light-9);
}

.el-table .warning-row {
    --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .danger-row {
    --el-table-tr-bg-color: var(--el-color-danger-light-9);
}

.el-table .info-row {
    --el-table-tr-bg-color: var(--el-color-info-light-9);
}
</style>