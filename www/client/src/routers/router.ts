import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import User from '../views/User.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: User },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
