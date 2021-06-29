import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Users from '../views/Users.vue'
import UserProfile from '../views/UserProfile.vue'
import ErrorPage from '../components/ErrorPage.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/users', name: 'Users', component: Users },
  { path: '/users/:id/profile', name: 'UserProfile', component: UserProfile },
  { path: '/:pathMatch(.*)*', name: 'ErrorPage', component: ErrorPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
