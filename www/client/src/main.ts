import { createApp } from 'vue'

import { router } from './router'
import App from './App.vue'

// TODO : Module out these imports
import './assets/css/reset.css'
import './assets/css/menu/window-header.css'
import './assets/css/menu/field-input.css'
import './assets/css/menu/action-button.css'
import './assets/css/menu/search-bar.css'

// -----------------------------------------------------------------------------
// Import Libraries
// -----------------------------------------------------------------------------
import contextmenu from 'v-contextmenu'
import 'v-contextmenu/dist/themes/dark.css'

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
const app = createApp(App).use(router).use(contextmenu)
const vm = app.mount('#root')
