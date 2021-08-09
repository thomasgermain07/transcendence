import { RouteRecordRaw } from "vue-router";

import NotFound from "@/views/error/NotFound.vue";

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/:catchAll(.*)',
		name: 'error-not-found',
		component: NotFound,

	},
];
