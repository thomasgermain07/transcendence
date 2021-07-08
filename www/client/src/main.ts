import { createApp } from 'vue'

import axios    from 'axios'
import VueAxios from 'vue-axios'

import App    from './App.vue'
import router from "./routers/router";
import {store} from './store/store'

// -----------------------------------------------------------------------------
// Axios Config
// -----------------------------------------------------------------------------
// Url
axios.defaults.baseURL = 'http://localhost:8080/api/';
// HTTP Headers
axios.defaults.headers.common['Content-type'] = "application/json";

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
createApp(App)
	.use(VueAxios, axios)
	.use(store)
	.use(router)
	.mount('#app')
	// .use(store, key)
