import { createApp } from 'vue'
import '@/style.css'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import VueAxios from 'vue-axios'
//import axios from 'axios'
import axios from '@/tools/axios'
import Router from '@/tools/router'
import Store from '@/tools/storage'

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
// app.use(VueAxios, axios)
app.use(Router)
app.use(Store)
app.config.globalProperties.$axios = axios
app.mount('#app')
