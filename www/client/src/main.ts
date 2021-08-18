import { createApp } from 'vue'

import { router } from './router'
import App from './App.vue'

import './assets/css/reset.css'
import './assets/css/menu/window-header.css'
import './assets/css/menu/field-input.css'
import './assets/css/menu/action-button.css'
import './assets/css/menu/search-bar.css'

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
const app = createApp(App).use(router)
const vm = app.mount('#root')
