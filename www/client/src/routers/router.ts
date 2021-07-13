import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Users from '../views/Users.vue'
import UserProfile from '../views/UserProfile.vue'
import Game from '../views/Game.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Marvin from '../views/MarvinAuth.vue'
import ErrorPage from '../components/ErrorPage.vue'
import { store } from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/users',
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: '/users/:id/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true },
  },
  {
    path: '/game',
    component: Game,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/auth/marvin/callback',
    name: 'Marvin',
    component: Marvin,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/:catchAll(.*)',
    component: ErrorPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// if the route requires auth, check if logged in. if not, redirect to login page.
// if the route is login, check if logged. if yes redirect to home page.
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth')

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: '/login',
      })
    } else {
      // if is Auth but page refresh -> api call to get current user info in store
      if (!store.state.user.id) {
        store.dispatch('checkAuth')
      }
      next()
    }
  } else if (to.path === '/login' && isAuthenticated) {
    next({
      path: '/',
    })
  } else {
    next()
  }
})

export default router
