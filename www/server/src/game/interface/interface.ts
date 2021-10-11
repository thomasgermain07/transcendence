import { GamePlayer } from "../gateways/game_player";
import { Ball } from "../gateways/ball";
import { Bonus } from "../gateways/bonus";
import { State } from "../gateways/game-rooms.gateway";
import { Paddle } from "../gateways/paddle";
import { GameMode } from "../enum/enum";


export interface IMapPaddleState {
    x: number
    y: number
    height: number
    move: string
    speed: number
  }
  
  export interface IGameState {
    status: string
    difficulty: string
    mode: GameMode
    addons: boolean
    begin: boolean
    map: string
    count: number
    interval: ReturnType<typeof setInterval>
  
  }
  
  export interface IBallState {
    x: number
    y: number
    rayon: number
    speed: number
    xspeed: number
    yspeed: number
    last_touch_id: number
  }
  
  export interface IBonusState {
    x: number
    y: number
    rayon: number
    last_touch_id: number
    exist: boolean
    time: number
  }
  
  export interface IPlayerState {
    position: string
    is_ready: boolean
    paddle: IMapPaddleState
    addons_date: number,
  }
  
  export interface IGameInfoState{
  
    player_left: GamePlayer,
    player_right: GamePlayer,
    ball: Ball,
    info: IGameState,
    map_paddle: IMapPaddleState[],
    bonus: Bonus,
  }
  
  
  export class Game implements IGameInfoState {
  
      player_left: GamePlayer;
      player_right: GamePlayer;
      ball: Ball;
      info: State;
      map_paddle: Paddle[];
      addon_ball: IBallState;
      bonus: Bonus;
    constructor(player_left: GamePlayer, player_right: GamePlayer, ball: Ball, info: State, map: Paddle[], bonus: Bonus) {
      this.player_left = player_left;
      this.player_right = player_right;
      this.ball = ball;
      this.info = info;
      this.map_paddle = map;
      this.bonus = bonus;
    }
  }