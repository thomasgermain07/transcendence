/*
    GAME ROOM TYPES AND INTERFACES
*/

import { Player } from './player'
import { GameOptions } from './gameOptions'

export enum GameMode {
  DUEL = 'duel',
  LADDER = 'ladder',
  PRIVATE = 'private',
}

export enum GameState {
  WAITING = 'waiting',
  PLAYING = 'playing',
  CANCELLED = 'cancelled',
  OVER = 'over',
  PAUSE = 'pause',
}

export interface Room {
  id: number
  mode: GameMode
  state: GameState
  locked: boolean
  option: GameOptions
  players: Player[]
}
