import { RouteRecordRaw } from 'vue-router'

import Index from '@/views/app/Index.vue'
import Home from '@/views/app/Home.vue'

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Index,
    redirect: {
      name: 'home',
    },
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
        // meta: { requiresAuth: true },
      },
    ],
  },
]
