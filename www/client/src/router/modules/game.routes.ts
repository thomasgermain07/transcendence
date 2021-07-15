import { RouteRecordRaw } from 'vue-router'

import Index from '@/views/game/Index.vue'
import Home from '@/views/game/Home.vue'
import GameRoom from '@/views/game/GameRoom.vue'

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/game',
    name: 'game',
    component: Index,
    redirect: {
      name: 'game-home',
    },
    children: [
      {
        path: '',
        name: 'game-home',
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: 'room/:id',
        component: GameRoom,
        // component: () => import("../views/Game.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
]
