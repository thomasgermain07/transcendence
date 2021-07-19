import { createApp } from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './routers/router'
import initAxios from './shared/axios.config'
import { store } from './store'

import './assets/reset.css'

// -----------------------------------------------------------------------------
// Axios Config
// -----------------------------------------------------------------------------
initAxios()

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
createApp(App).use(VueAxios, axios).use(router).use(store).mount('#app')
