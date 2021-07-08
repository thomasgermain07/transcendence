import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import {store} from '../store'

export interface IPlayerState {
  id: number
  position: string
  score: number
  winner: boolean
  is_ready: boolean
  x: number
  y: number
  move: string
  cont: any
}

@Module({name: "Player", dynamic: true, store})
class Player extends VuexModule implements IPlayerState {
  public id = 0
  public position = ''
  public score = 0
  public winner = false
  public is_ready = false
  public x = 0
  public y = 0
  public move = ""
  public ctx = null

  get GetPlayer() {
    return this;
  }

  get GetCtx() {
    return this.ctx;
  }

  get GetMove() {
    return this.move;
  }

  get GetMoveAndPos() {
    return {move: this.move, x: this.x, y: this.y};
  }

  get GetPosX() {
    return this.x;
  }
  get GetPosY() {
    return this.y;
  }

  @Mutation
  SET_PLAYER(player: IPlayerState): void {
    this.id = player.id
    this.position = player.position
    this.score = player.score
    this.winner = player.winner
    this.is_ready = player.is_ready
    this.move = ""
    this.ctx = null
    if (this.position == "left") {
      this.x = 600/10
      this.y = 400/2 - 40
    }
    else {
      this.x = 600/1.1
      this.y = 400/2 - 40
    }
  }

  @Mutation
  SET_MOVE(move: string): void {
    this.move = move
  }

  @Mutation
  SET_POSITION(y: number): void {
    this.y = y
  }

  @Mutation
  SET_CONTEXT(ctx: Object): void {
    this.ctx = ctx
  }

  @Action
  SetPlayer(player: IPlayerState): void {
    this.SET_PLAYER(player)
  }

  @Action
  SetMove(move: string): void {
    this.SET_MOVE(move)
  }

  @Action
  SetPosition(y: number): void {
    this.SET_POSITION(y)
  }

  @Action
  SetContext(ctx: any): void {
    this.SET_CONTEXT(ctx)
  }

}

export default getModule(Player);