import './assets/main.css'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'jsvectormap/dist/jsvectormap.css'
import 'flatpickr/dist/flatpickr.css'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import Vue3Toastify from 'vue3-toastify'
import './axios-setup'

const app = createApp(App)

app.use(router)
app.use(VueApexCharts)
app.use(Vue3Toastify, {
  position: 'bottom-right'
})

app.mount('#app')
