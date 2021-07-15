/*
    GAME ROOM TYPES AND INTERFACES
*/

import { User } from '../user'
import { Room } from './gameRoom'

export interface Player {
  id: number
  position: string
  score: number
  winner: boolean | null
  isReady: boolean
  user: User
  room: Room
}
