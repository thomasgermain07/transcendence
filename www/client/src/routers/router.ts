import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    alias: '/home',
    name: 'home',
    component: () => import("../components/Home.vue"),
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;
