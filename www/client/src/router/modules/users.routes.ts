import { RouteRecordRaw } from 'vue-router'

import Index from '@/views/users/Index.vue'
import Users from '@/views/users/Users.vue'
import Profile from '@/views/users/Profile.vue'

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/users',
    name: 'users',
    component: Index,
    redirect: {
      name: 'users-list',
    },
    children: [
      {
        path: '',
        name: 'users-list',
        component: Users,
        meta: { requiresAuth: true },
      },
      {
        path: ':id?/profile',
        name: 'user-profile',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
]
