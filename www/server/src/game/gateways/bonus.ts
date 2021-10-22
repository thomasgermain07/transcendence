import { IBonusState } from '../interface/interface';
import { WIDTH } from './ball';
import { Ball } from './ball';

export class Bonus implements IBonusState {
	x: number;
	y: number;
	rayon: number;
	last_touch_id: number;
	exist: boolean;
	time: number;
	constructor(
		x: number,
		y: number,
		rayon: number,
		last_touch_id: number,
		exist: boolean,
		time: number,
	) {
		this.x = x;
		this.y = y;
		this.rayon = rayon;
		this.last_touch_id = last_touch_id;
		this.exist = exist;
		this.time = time;
	}

	startBonus() {
		if (!this.exist) {
			this.x = Math.random() * (WIDTH - 200) + 200;
			this.y = Math.random() * (200 - 100) + 100;
			this.rayon = 8;
			this.last_touch_id = 0;
			this.exist = true;
			this.time = Date.now();
		}
	}
	ballBonusCollision(ball: Ball) {
		const topX = ball.x + ball.rayon;
		const topY = ball.y + ball.rayon;
		const botX = ball.x - ball.rayon;
		const botY = ball.y - ball.rayon;

		const bonusTop = this.y;
		const bonusRight = this.x + this.rayon;
		const bonusBot = this.y + this.rayon;
		const bonusLeft = this.x;

		if (
			botX < bonusRight &&
			botY < bonusBot &&
			topX > bonusLeft &&
			topY > bonusTop
		) {
			this.last_touch_id = ball.last_touch_id;
		}
	}
}
