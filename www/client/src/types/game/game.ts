/*
GAME VUE TYPES AND INTERFACES
*/
import { Player } from './player'

// Type to check if user is in active game room
export type InGameType = {
  inGame: boolean
  roomRoute: string
  player: Player
}

export type LobbyType = {
  visible: boolean
  matched: boolean
  player: Player
}
