/*
GAME VUE TYPES AND INTERFACES
*/
import { Player } from './player'
import { UserType } from '../user/user'
import { Room } from '@/types/game/gameRoom'

export type InGameType = {
  inGame: boolean
  roomRoute: string
  player?: Player
}

export type LobbyType = {
  visible: boolean
  matched: boolean
  player: Player | null
}

export interface IGameState {
  status: string
  difficulty: string
  mode: string
  powerUps: boolean
  begin: boolean
  map: string
  count: number
}
export interface IBonusState {
  x: number
  y: number
  rayon: number
  exist: boolean
}

export interface Paddle {
  x: number
  y: number
  height: number
  move: string
}

export interface GamePlayer {
  id: number
  user: UserType | null
  room: Room | null
  position: string
  score: number
  winner: boolean
  isReady: boolean
  isPause: boolean
  paddle: Paddle
}
