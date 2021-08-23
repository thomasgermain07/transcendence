import { Paddle } from "./paddle"
import { IPlayerState } from "../interface/interface"

export class GamePlayer implements IPlayerState {
    private id: number
    private user_id: number
    position: string
    private score: number
    private winner: boolean
    is_ready: boolean
    paddle: Paddle
    addons_date: number
    constructor (
      id: number,
      user_id: number,
      position: string,
      score: number,
      winner: boolean,
      is_ready: boolean,
      paddle: Paddle,
      addons_date: number,
    ) {
      this.id = id;
      this.user_id = user_id;
      this.position = position;
      this.score = score;
      this.winner = winner;
      this.is_ready = is_ready;
      this.paddle = paddle; 
      this.addons_date = addons_date;
    }

    getId() {
        return this.id;
    }

    getUserId() {
        return this.user_id;
    }

    getWinner() {
        return this.winner;
    }  

    getScore() {
        return this.score;
    }
    
    setWinner(val: boolean): void {
        this.winner = val;
    }

    checkChangePaddleSize() {
      if ( (Date.now() - this.addons_date) >= 10000) {
        this.paddle.newHeight = 5;
      }
      else {
        this.paddle.newHeight = 3.2;
      }
    }

    addScore() {
        this.score += 1;
    }
    
  }