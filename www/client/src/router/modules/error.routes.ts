import { RouteRecordRaw } from "vue-router";

import NotFound from "@/views/error/NotFound.vue";

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/:catchAll(.*)',
		name: 'error-not-found',
		component: NotFound,

	},
];
