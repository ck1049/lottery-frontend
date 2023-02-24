<script setup>
import { watch } from 'vue';
import { onMounted, getCurrentInstance, ref, reactive } from 'vue';

const currentInstance = getCurrentInstance();
const $axios = currentInstance.appContext.config.globalProperties.$axios;

const pageInfo = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const getLottoPageInfo = url => $axios.get(url).then(response => pageInfo.value = response).catch(error => console.log(`error===${error}`));

onMounted(() => getLottoPageInfo(`/lotto/index/1/${pageSize.value}`));

const rowStyleMap = { 0: "warning", 1: "success", 2: "warning", 3: "danger", 4: "info" };

const rowStyle = ({ row, rowIndex }) => ({ "--el-table-tr-bg-color": `var(--el-color-${rowStyleMap[rowIndex % 5]}-light-9)` });

watch(currentPage, (newValue, oldValue) => getLottoPageInfo(`/lotto/index/${newValue}/${pageSize.value}`));

watch(pageSize, (newValue, oldValue) => getLottoPageInfo(`/lotto/index/1/${newValue}`).then(currentPage.value = 1));

</script>
<template>
    <div class="common-layout">
        <el-container>
            <el-header>体彩大乐透开奖信息</el-header>
            <el-main style="padding: 0;">
                <el-table :data="pageInfo.list" :row-class-name="tableRowClassName" table-layout="auto"
                    :row-style="rowStyle">
                    <el-table-column :xs="5" :sm="5" :md="5" :lg="5" prop="issueNumber" label="期号" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="red1" label="红球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="red2" label="红球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="red3" label="红球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="red4" label="红球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="red5" label="红球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="blue1" label="蓝球" />
                    <el-table-column :xs="2" :sm="2" :md="2" :lg="2" prop="blue2" label="蓝球" />
                    <el-table-column :xs="5" :sm="5" :md="5" :lg="5" prop="awardDate" label="开奖日期" />
                </el-table>
            </el-main>
            <el-footer style="padding: 0;margin-top: 3px;">
                <el-pagination background layout="prev, pager, next, sizes, jumper, ->, total" :total="pageInfo.total"
                    :page-count-="pageInfo.pages" :page-sizes="[10, 20, 30, 50]" v-model:page-size="pageSize"
                    v-model:current-page="currentPage" :pager-count="9" @size-change="handleSizeChange" />
            </el-footer>
        </el-container>
    </div>
</template>
<style scoped>
</style>