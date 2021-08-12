import { RouteRecordRaw } from 'vue-router'

import Index from '@/views/game/Index.vue'
import Home from '@/views/game/Home.vue'
import Duel from '@/views/game/Duel.vue'
import Ladder from '@/views/game/Ladder.vue'
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
    // meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'game-home',
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: 'duel',
        name: 'game-duel',
        component: Duel,
        meta: { requiresAuth: true },
      },
      {
        path: 'ladder',
        name: 'game-ladder',
        component: Ladder,
        meta: { requiresAuth: true },
      },
      {
        path: 'room/:id',
        name: 'game-room',
        component: GameRoom,
        // component: () => import("../views/Game.vue"),
        meta: { requiresAuth: true },
      },
    ],
  },
]
