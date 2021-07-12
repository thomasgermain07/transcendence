import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Game from '../views/Game.vue'
import Login from '../views/Login.vue'
import Chat from '../views/Chat.vue'
import Register from '../views/Register.vue'
import Marvin from '../views/MarvinAuth.vue'
import { store } from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/user',
    component: User,
    meta: { requiresAuth: true },
  },
  {
    path: '/game',
    component: Game,
    meta: { requiresAuth: true },
  },
  {
    path: '/chat',
    component: Chat,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    // component: () => import("../views/Login.vue"),
  },
  {
    path: '/auth/marvin/callback',
    name: 'Marvin',
    component: Marvin,
    // component: () => import("../views/Login.vue"),
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
    // name: "NotFound",
    // component: PageNotFound,
    // meta: {
    //   requiresAuth: false
    // }
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
