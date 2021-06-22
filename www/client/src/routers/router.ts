import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Game from '../views/Game.vue'
import Profile from '../views/Profile.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User },
  { path: '/game', component: Game },
  { path: '/profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
