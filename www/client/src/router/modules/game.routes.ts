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
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'game-home',
        component: Home,
      },
      {
        path: 'duel',
        name: 'game-duel',
        component: Duel,
      },
      {
        path: 'ladder',
        name: 'game-ladder',
        component: Ladder,
      },
      {
        path: 'room/:id',
        name: 'game-room',
        component: GameRoom,
      },
    ],
  },
]
