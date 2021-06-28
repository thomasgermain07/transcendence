import { createApp } from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './routers/router'
import { store } from './store'

import initAxios from './shared/axios.config'

// -----------------------------------------------------------------------------
// Axios Config
// -----------------------------------------------------------------------------
initAxios()

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
createApp(App).use(VueAxios, axios).use(router).use(store).mount('#app')
