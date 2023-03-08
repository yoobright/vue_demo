import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import en from './locales/en'
import zh from './locales/zh'
import { createI18n } from 'vue-i18n'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const i18n = createI18n({
    legacy: false,
    locale: 'zh',
    messages: {
      en,
      zh
    }
  })

// import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(i18n)
app.mount('#app')
