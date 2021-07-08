import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Login from '../views/Login.vue'
import Logout from '../views/Logout.vue'
import Game from '../views/Game.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User },
  { path: '/login', component: Login },
  { path: '/logout', component: Logout },
  { path: '/game', component: Game },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
