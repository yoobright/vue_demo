import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/dark/css-vars.scss'

import en from './locales/en'
import zh from './locales/zh'
import { createI18n } from 'vue-i18n'

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
// app.use(ElementPlus)

app.use(i18n)
app.mount('#app')
