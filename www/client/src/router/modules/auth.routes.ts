import { RouteRecordRaw } from "vue-router";

import Index               from "@/views/auth/Index.vue";
import Register            from "@/views/auth/Register.vue";
import Login               from "@/views/auth/Login.vue";
import LoginMarvinCallback from "@/views/auth/LoginMarvinCallback.vue";
import Logout              from "@/views/auth/Logout.vue";

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/auth',
		name: 'auth',
		component: Index,
		redirect: {
			name: 'auth-login',
		},
		children: [
			{
				path: 'register',
				name: 'auth-register',
				component: Register,
			},
			{
				path: 'login',
				name: 'auth-login',
				component: Login,
			},
			{
				path: 'marvin/callback',
				name: 'auth-marvin',
				component: LoginMarvinCallback,
			},
			{
				path: 'logout',
				name: 'auth-logout',
				component: Logout,
			},
		],
	},
];
