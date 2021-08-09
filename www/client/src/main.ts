import { createApp } from "vue";

import { router } from "./router";
import App        from "./App.vue";

// -----------------------------------------------------------------------------
// Start Application
// -----------------------------------------------------------------------------
const app = createApp(App)
	.use(router)
;

const vm = app
	.mount('#root')
;
