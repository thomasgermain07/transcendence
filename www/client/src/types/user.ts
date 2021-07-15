import { Player } from './game/player'

export interface User {
  id: number
  email: string
  name: string
  marvinId: number | null
  avatar: string | null
  players: Player[]
}
