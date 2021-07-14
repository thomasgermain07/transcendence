import { Router }           from "vue-router";
import { RouteRecordRaw }   from "vue-router";
import { createRouter }     from "vue-router";
import { createWebHistory } from "vue-router";

import { useAuth } from "@/composables/auth";

import { routes as app_routes }   from "./modules/app.routes";
import { routes as auth_routes }  from "./modules/auth.routes";
import { routes as user_routes }  from "./modules/user.routes";
import { routes as game_routes }  from "./modules/game.routes";
import { routes as error_routes } from "./modules/error.routes";

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
const routes: Array<RouteRecordRaw> = [
	...app_routes,
	...auth_routes,
	...user_routes,
	...game_routes,
	...error_routes,
];

// -----------------------------------------------------------------------------
// Router
// -----------------------------------------------------------------------------
export const router: Router = createRouter({
	history: createWebHistory(),
	routes: routes,
});

// -----------------------------------------------------------------------------
// Hooks
// -----------------------------------------------------------------------------
router.beforeEach((to, from, next) => {
	const { is_authenticated } = useAuth();
	const not_authenticated_required: boolean = [
		'auth-login',
		'auth-marvin',
		'auth-register'
	].includes(to.name as string);

	if (to.meta.requiresAuth && !is_authenticated.value)
	{
		next({ name: 'auth-login' });
	}
	else if (not_authenticated_required && is_authenticated.value)
	{
		next({ name: 'index', replace: true });
	}
	else
	{
		next();
	}
});