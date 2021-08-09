import { RouteRecordRaw } from "vue-router";

import Index from "@/views/game/Index.vue";
import Home  from "@/views/game/Home.vue";

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/game',
		name: 'game',
		component: Index,
		redirect: {
			name: 'game-home',
		},
		children: [
			{
				path: '',
				name: 'game-home',
				component: Home,
				meta: { requiresAuth: true },
			}
		],
	},
];
