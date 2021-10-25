<template>
	<div class="game-board">
		<div class="game-pause" v-if="props.roomState == 'pause'">
			<div class="loader-ctn">
				<div class="loader"></div>
				<p>
					A player has been disconnected. The game will resume on reconnection
					or in
				</p>
				<p class="timer">{{ props.timer }}</p>
			</div>
		</div>
		<div id="screen"></div>
		<canvas id="canvas" width="600" height="400"></canvas>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { DifficultyLevel, MapType } from '../../types/game/gameOptions';
import { Ball } from '../../types/game/ball';
import { IMapPaddleState } from '../../types/game/paddle';
import { useAuth } from '../../composables/auth';
import { useSocket } from '../../composables/socket';
import { Game, IGameState } from '@/types/game/game';
import { updateDataType } from '@/types/game/updateData';
import { Player } from '@/types/game/player';
import { Bonus } from '@/types/game/bonus';

export default defineComponent({
	name: 'GameBoard',
	props: ['roomName', 'isPlayer', 'roomState', 'timer'],
	setup(props) {
		let player_left: Player = {
			id: 0,
			user: null,
			room: null,
			position: '',
			score: 0,
			winner: false,
			isReady: false,
			isPause: false,
			paddle: {
				x: 0,
				y: 0,
				height: 0,
				move: '',
			},
		};
		let player_right: Player = {
			id: 0,
			user: null,
			room: null,
			position: '',
			score: 0,
			winner: false,
			isReady: false,
			isPause: false,
			paddle: {
				x: 0,
				y: 0,
				height: 0,
				move: '',
			},
		};
		let ball: Ball = {
			x: 0,
			y: 0,
			rayon: 0,
			xspeed: 0,
			yspeed: 0,
			exist: true,
		};
		let bonus: Bonus = {
			x: 0,
			y: 0,
			rayon: 0,
			exist: false,
		};
		let option: IGameState = {
			status: 'waiting',
			mode: 'duel',
			map: MapType.DEFAULT,
			difficulty: DifficultyLevel.EASY,
			powerUps: false,
			begin: false,
			count: 3,
		};
		let map_paddle = new Array<IMapPaddleState>();

		let canvas: HTMLCanvasElement;
		let screen: HTMLElement | null;
		let ctx: CanvasRenderingContext2D;

		const gameRoomsSocket = useSocket('game-rooms').socket;
		const roomName: string = props.roomName;
		const isPlayer: boolean = props.isPlayer;

		const { user } = useAuth();
		const currentUser = user;

		const initCanvas = (): void => {
			canvas = <HTMLCanvasElement>document.getElementById('canvas');
			screen = document.getElementById('screen');
			ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		};

		function drawMap(): void {
			ctx.fillStyle = '#000000';
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			if (option.map != MapType.MAP1) {
				drawMidleLine();
			}
			for (var paddle of map_paddle) {
				ctx.beginPath();
				ctx.fillStyle = 'white';
				var data = update(paddle.x, paddle.y);
				if (option.map == MapType.MAP1) {
					ctx.fillRect(data.x, data.y, canvas.width / 80, canvas.height / 2.5);
				} else {
					ctx.fillRect(data.x, data.y, canvas.width / 80, canvas.height / 5);
				}
				ctx.fill();
				ctx.closePath();
			}
			draw();
		}
		function update(x: number, y: number): updateDataType {
			const update_data: updateDataType = {
				x: x * (canvas?.width / 600),
				y: y * (canvas?.height / 400),
			};
			return update_data;
		}
		function resizeCanvas(): void {
			if (screen) {
				canvas.width = screen.offsetWidth;
				canvas.height = canvas?.width / 2;
				redraw();
			}
		}
		function redraw(): void {
			drawMap();
			draw();
		}
		function keydown(event: KeyboardEvent): void {
			if (event.key === 'ArrowUp') {
				gameRoomsSocket.emit('move', {
					move: 'up',
					user_id: currentUser?.id,
					room: roomName,
				});
			} else if (event.key === 'ArrowDown') {
				gameRoomsSocket.emit('move', {
					move: 'down',
					user_id: currentUser?.id,
					room: roomName,
				});
			}
			event.preventDefault();
			gameRoomsSocket.off('move');
		}
		function keyup(event: KeyboardEvent): void {
			if (event.key === 'ArrowUp') {
				gameRoomsSocket.emit('move', {
					move: 'not',
					user_id: currentUser?.id,
					room: roomName,
				});
			} else if (event.key === 'ArrowDown') {
				gameRoomsSocket.emit('move', {
					move: 'not',
					user_id: currentUser?.id,
					room: roomName,
				});
			}
			event.preventDefault();
			gameRoomsSocket.off('move');
		}
		function draw(): void {
			drawPaddle();
			drawBall();
			if (bonus.exist) {
				drawAddon();
			}
		}
		function countdown(): void {
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.font = '48px Courier New';
			if (option.count > 0)
				ctx.fillText(
					option.count.toString(),
					canvas.width / 2,
					canvas.height / 2,
				);
			else if (option.count == 0)
				ctx.fillText('GO', canvas.width / 2, canvas.height / 2);
		}
		function drawMidleLine(): void {
			ctx.strokeStyle = 'white';
			ctx.beginPath();
			ctx.setLineDash([5, 15]);
			ctx.moveTo(canvas.width / 2, canvas.height - 50);
			ctx.lineTo(canvas.width / 2, 50);
			ctx.lineWidth = 5;
			ctx.stroke();
			ctx.moveTo(
				canvas.width * (canvas.width / 1088) - 600 / 80,
				canvas.height * (canvas.height / 544) - 80,
			);
			ctx.lineTo(
				canvas.width * (canvas.width / 1088) + 600 / 80,
				canvas.height * (canvas.height / 544) - 80,
			);
			ctx.lineTo(
				canvas.width * (canvas.width / 1088) + 600 / 80,
				canvas.height * (canvas.height / 544) + 80,
			);
			ctx.lineTo(
				canvas.width * (canvas.width / 1088) - 600 / 80,
				canvas.height * (canvas.height / 544) + 80,
			);
			ctx.fill();
			ctx.closePath();
		}
		function drawPaddle(): void {
			ctx.beginPath();
			ctx.fillStyle = 'white';
			var data = update(player_left.paddle.x, player_left.paddle.y);
			ctx.fillRect(
				data.x,
				data.y,
				canvas.width / 80,
				canvas.height / player_left.paddle.height,
			);
			data = update(player_right.paddle.x, player_right.paddle.y);
			ctx.fillRect(
				data.x,
				data.y,
				canvas.width / 80,
				canvas.height / player_right.paddle.height,
			);
			ctx.fill();
			ctx.closePath();
		}
		function drawBall(): void {
			ctx.beginPath();
			ctx.fillStyle = 'white';
			var data = update(ball.x, ball.y);
			ctx.arc(data.x, data.y, canvas.width / 100, 0, Math.PI * 2, false);
			ctx.fill();
			ctx.closePath();
		}
		function drawAddon(): void {
			ctx.beginPath();
			ctx.fillStyle = 'red';
			var data = update(bonus.x, bonus.y);
			ctx.fillRect(data.x, data.y, canvas.width / 50, canvas.width / 50);
			ctx.fill();
			ctx.closePath();
		}

		gameRoomsSocket.on('begin', (data: Game) => {
			initCanvas();
			player_left = data?.player_left;
			player_right = data?.player_right;
			ball = data?.ball;
			option = data?.info;
			map_paddle = data?.map_paddle;
			bonus = data?.bonus;
			drawMap();
			if (option?.begin) {
				countdown();
			}
		});

		const setEventListeners = (): void => {
			window.addEventListener('keydown', keydown);
			window.addEventListener('keyup', keyup);
			window.addEventListener('resize', resizeCanvas, false);
		};

		const unsetEventListeners = (): void => {
			window.removeEventListener('keydown', keydown);
			window.removeEventListener('keyup', keyup);
			window.removeEventListener('resize', resizeCanvas, false);
		};

		onMounted(() => {
			if (isPlayer) {
				setEventListeners();
			}
		});
		onUnmounted(() => {
			gameRoomsSocket.off();
			if (isPlayer) {
				unsetEventListeners();
			}
		});
		return {
			props,
		};
	},
});
</script>

<style scoped>
#screen {
	max-width: 600px;
	max-height: 400px;
}
.loader-ctn {
	padding-right: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.timer {
	padding-top: 5px;
}
.loader {
	border: 6px solid white;
	border-top: 6px solid red;
	border-radius: 50%;
	width: 18px;
	height: 18px;
	animation: spin 2s linear infinite;
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
