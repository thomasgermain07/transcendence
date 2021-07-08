import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import {store} from '../store'

export interface IBallState {
  x: number
  y: number
  rayon: number
  xspeed: number
  yspeed: number 
}

@Module({name: "Ball", dynamic: true, store})
class Ball extends VuexModule implements IBallState {
  public x = 0
  public y = 0
  public rayon = 0
  public xspeed = 0
  public yspeed = 0

  get GetBall() {
    return this;
  }

  get GetPosX() {
    return this.x;
  }
  get GetPosY() {
    return this.y;
  }

  @Mutation
  SET_BALL(ball: IBallState): void {
    this.x = 600/2
    this.y = 400/2
    this.rayon = 5
    this.xspeed = 3
    this.yspeed = 3
  }

  @Mutation
  SET_POSITION_X(x: number): void {
    this.x = x
  }

  @Mutation
  SET_POSITION_Y(y: number): void {
    this.y = y
  }


  @Action
  SetBall(ball: IBallState): void {
    this.SET_BALL(ball)
  }

  @Action
  SetPositionX(x: number): void {
    this.SET_POSITION_X(x)
  }

  @Action
  SetPositionY(y: number): void {
    this.SET_POSITION_Y(y)
  }

}

export default getModule(Ball);