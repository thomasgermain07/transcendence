/*
    GAME ROOM TYPES AND INTERFACES
*/

import { User } from '../user'
import { Room } from './gameRoom'
import { IMapPaddleState } from "./paddle"

export interface Player {
  id: number
  position: string
  score: number
  winner: boolean | null
  isReady: boolean
  user: User
  room: Room
  paddle: IMapPaddleState
}
