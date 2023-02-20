import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
import axios from 'axios'
import Router from '@/tools/router'
import Store from '@/tools/storage'

const app = createApp(App)
app.use(ElementPlus)
// app.use(VueAxios, axios)
app.use(Router)
app.use(Store)
app.config.globalProperties.$axios = axios
app.mount('#app')
