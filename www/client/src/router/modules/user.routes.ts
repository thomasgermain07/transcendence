import { RouteRecordRaw } from "vue-router";

import Index   from "@/views/user/Index.vue";
import Profile from "@/views/user/Profile.vue";

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
export const routes: Array<RouteRecordRaw> = [
	{
		path: '/user',
		name: 'user',
		component: Index,
		redirect: {
			name: 'user-profile',
		},
		children: [
			{
				path: '',
				alias: 'profile',
				name: 'user-profile',
				component: Profile,
				meta: { requiresAuth: true },
			}
		],
	},
];
