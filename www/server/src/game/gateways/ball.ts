import { IBallState } from "../interface/interface";

export const WIDTH = 300
export const HEIGHT = 600

export class Ball implements IBallState {
    x: number;
    y: number;
    readonly rayon: number;
    speed: number;
    xspeed: number;
    yspeed: number;
    last_touch_id: number;
    constructor (
      speed: number,
      xspeed: number,
      yspeed: number,
    ) {
      this.x = HEIGHT/2;
      this.y = WIDTH/2;
      this.rayon = 5;
      this.speed = speed;
      this.xspeed = xspeed;
      this.yspeed = yspeed;
      this.last_touch_id = 0; 
    }
    changeSpeed(speed: number, xspped: number, yspeed: number ) {
      this.speed = speed;
      this.xspeed = xspped;
      this.yspeed = yspeed;
    }
    addSpeedBall() {
      this.x += this.xspeed;
      this.y += this.yspeed;
    }
  }