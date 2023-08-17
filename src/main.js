import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn  from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'





const app = createApp(App)
for(const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(ElementPlus,{locale:zhCn})
app.mount('#app')

//全局变量

import urls from './api/api'
import request from './api/request'
import tips from './config/Tips'


//请求地址
app.config.globalProperties.$urls=urls

//请求方法
app.config.globalProperties.$request=request

//弹窗提示
app.config.globalProperties.$tips=tips