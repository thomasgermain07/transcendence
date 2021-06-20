import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Users from '../views/Users.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/user', component: Users },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
