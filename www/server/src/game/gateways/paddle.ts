import { IBallState, IMapPaddleState } from "../interface/interface"
import { Direction } from "../enum/enum"
import { HEIGHT, WIDTH } from "./ball"

export class Paddle implements IMapPaddleState {
    x: number
    y: number
    height: number
    move: string
    speed: number
    constructor (
      x: number,
      y: number,
      height: number,
      move: string,
      speed: number,
    ) {
      this.x = x;
      this.y = y;
      this.height = height;
      this.move = move;
      this.speed = speed;
    }
  
    set newHeight(newHeight: number) {
      this.height = newHeight;    
    }
  
    paddle_move(ball: IBallState) : void {
      const topX = ball.x + ball.rayon;
      const topY = ball.y + ball.rayon;
      const botX = ball.x - ball.rayon;
      const botY = ball.y - ball.rayon;
      if ( this.move == Direction.UP ) {
          const upy = this.y - this.speed;
          if (topX > this.x && botX < this.x + HEIGHT/80 && topY + ball.yspeed > upy && botY + ball.yspeed < upy +  (WIDTH / this.height))
          {
            this.y = topY + ball.yspeed;
          }
          this.y = (upy <= 0) ? 0 : upy;
      }
      else if (this.move == Direction.DOWN ) {
          const downy = this.y + this.speed;
          if ( topX > this.x && botX < this.x + HEIGHT/80 && topY + ball.yspeed > downy && botY + ball.yspeed < downy +  (WIDTH / this.height)) {
            this.y = topY + ball.yspeed;
          }
          this.y = (downy + (WIDTH / this.height)) >= WIDTH ? WIDTH - (WIDTH / this.height) : downy;
      }
  }
  
  }