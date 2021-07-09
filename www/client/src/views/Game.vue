<template>
  <div class="game"> View
	 <div ref="screen"> </div>
	 <canvas ref="canvas" width="600" height="400" style="border: 1px solid black;"></canvas>
	  <!-- <form id="create-post-form" @submit.prevent="Up">
			<div class="form-group col-md-4 pull-right">
					<button class="btn btn-success" type="submit"> up </button>
			</div>
		</form>
		<form id="create-post-form" @submit.prevent="Down">
			<div class="form-group col-md-4 pull-right">
					<button class="btn btn-success" type="submit"> down </button>
			</div>
		</form> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onBeforeMount, reactive, toRefs, computed, onUpdated } from 'vue'
import {useRoute, useRouter} from 'vue-router';
import { useStore } from 'vuex'
import { store } from '../store/store';
import { io } from 'socket.io-client';
import { ref } from 'vue';
import PlayerModule from '../store/modules/player';
import PlayerRightModule from '../store/modules/playerRight';
import axios from "axios";
import { IPlayerState } from '../interface/i_player'
import { IBallState } from '../interface/i_ball'



export default defineComponent({
	name: 'Game',
  setup() {

		let player_left: IPlayerState = {
			id: 0 ,
			user_id: 0,
			position:  '',
			score:  0,
			winner:  false,
			is_ready:  false,
			x:  0,
			y:  0,
			move:  "",
		};
		let player_right: IPlayerState = {
			id: 0 ,
			user_id: 0,
			position:  '',
			score:  0,
			winner:  false,
			is_ready:  false,
			x:  0,
			y:  0,
			move:  "",
		};
		let ball: IBallState = {
			x: 0,
			y: 0,
			rayon: 0,
			xspeed: 0,
			yspeed: 0, 
		};

		// console.log("SetUp");
		// const store = useStore();
		// console.log(store)

		// const playersStore = computed(() => PlayerModule.GetPlayer)

		let canvas = ref(null);
		const screen = ref(null);
		const socket = io('http://localhost:8080/game');
		let user_id = 0;
		let ctx = null;
		let room = null;
			onBeforeMount(() => {
			// check if user is loggedin
			console.log("Beffore Mounted");
			getUser();
			async function getUser() {
				await axios
					.get(`auth`, {
						withCredentials: true,
						credentials: 'include',
					})
					.then((response) => {
						console.log('User is logged in')
						console.log(response)
						user_id = response.data.id
						getRoom();
						async function getRoom() {
							await axios
								.post(`http://localhost:8080/api/rooms/`, null, {
									withCredentials: true,
									credentials: 'include',
								})
								.then(resp => {
									// console.log(resp.data.name);
									room = resp.data.name;
									ctx = canvas.value.getContext("2d");
									// socket.connect();
									// socket.on('connect', () => {
										console.log("Connect");
									socket.emit('joinRoom', resp.data.name );
									// })
									socket.on('joinedRoom', () => {
										// console.log("HAVE JOIN THE ROOM");
									})
									// socket.emit('joinRoom', resp.data.name );
									if (resp.data.players[0] && resp.data.players[1]) {
										// console.log("----------------IF--------------------");
										socket.emit('init', { data: resp.data.players[0], room: resp.data.name });
										socket.emit('init', { data: resp.data.players[1], room: resp.data.name });
										socket.off('init');
										socket.on('initClient', (data) => {
											// console.log("------------------------------------");
											// console.log(user_id);
											// console.log(data);
											// console.log("------------------------------------");

											if (data.player_left.id != 0) {
												player_left = data.player_left;
											}
											if (data.player_right.id != 0) {
												player_right = data.player_right;
											}
											ball = data.ball;
											console.log(player_left);
											console.log(player_right);
											console.log(ball);
											if ( player_left.is_ready && player_right.is_ready ) {
												// console.log("IS_READY");
												// console.log(player_left.is_ready);
												// console.log(player_right.is_ready);
												// ctx = canvas.value.getContext("2d");
												// console.log(ctx)
												// ctx.fillStyle = "#FFFFFF";
												socket.emit('begin', { begin: true, id: user_id, ctx: ctx, room: data.room});
											}
										});
									}
								})

						}
					})
					.catch((err) => {
						// console.log(err.response.data)
						
						// console.log('User is not logged in')
					})
			}
		})
		
		onMounted(() => {
			// console.log("OnMounted");
			// ctx = canvas.value.getContext("2d");
			window.addEventListener("keydown", keydown);
			window.addEventListener("keyup", keyup);
			window.addEventListener('resize', resizeCanvas, false);
		})
		
		onUnmounted(() => {
			// console.log("ON Unmounted");
			window.removeEventListener("keydown", keydown);
			window.removeEventListener("keyup", keyup);
			window.removeEventListener("resize", resizeCanvas, false);
			socket.off('move');
			socket.off('init');
			socket.off('begin');
		})

		// onUpdated(() => {
		// 	draw();
		// })

		socket.on('begin', (data) => {
			// console.log("------------------------------------");
			// console.log(user_id);
			// console.log(data.player_left["user_id"]);
			// console.log(data.player_right["user_id"]);
			// console.log("------------------------------------");

			player_left = data.player_left;
			player_right = data.player_right;
			// ctx = data.ctx;

			ball = data.ball;
			ctx.fillStyle = "#000000";
			ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
			ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
			draw();
		})
		// socket.off('begin');
		// socket.off('');

		function update(x: number, y: number) {

			const update_data = {x: x * (canvas.value.width / 600), y: y * (canvas.value.height / 400)};
			return update_data;
		}

		function resizeCanvas() {
			if (screen) {
				// console.log(window.innerWidth);
				canvas.value.width = window.innerWidth;
				canvas.value.height = canvas.value.width / 2;
				redraw();
			}
		}

		function redraw() {
			ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
			ctx.fillStyle = 'black';
			ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
			draw();
		}

		function keydown(event: KeyboardEvent) {
			console.log("KEY PRESS");
      		if (event.key === "ArrowUp") {
				socket.emit('move', { move: "up", user_id: user_id, room: room });
				console.log("KEY UP");
			}
			else if (event.key === "ArrowDown") {
				socket.emit('move', { move: "down",  user_id: user_id, room: room });
					console.log("KEY Down");
			}
			socket.off('move');
		}

		function keyup(event: KeyboardEvent) {
			if (event.key === "ArrowUp") {
				socket.emit('move', { move: "not", user_id: user_id, room: room});
				console.log("KEY UP");
			}
			else if (event.key === "ArrowDown") {
				socket.emit('move', { move: "not",  user_id: user_id, room: room});
					console.log("KEY Down");
			}
			socket.off('move');

		}

		function draw() {
			console.log("DRAW");
			drawMidleLine();
			drawPaddle();
			drawBall();
			drawScore();
		}

		function drawMidleLine() {
			ctx.strokeStyle = 'white';
			ctx.beginPath();
			ctx.setLineDash([5, 15]);
			ctx.moveTo(canvas.value.width / 2, canvas.value.height - 50);
			ctx.lineTo(canvas.value.width / 2, 50);
			ctx.lineWidth = 5;
			ctx.stroke()

			ctx.moveTo(canvas.value.width * (canvas.value.width / 1088) - 600/80, canvas.value.height * (canvas.value.height / 544) - 80); // bottom left
			ctx.lineTo(canvas.value.width * (canvas.value.width / 1088) + 600/80, canvas.value.height * (canvas.value.height / 544) - 80); // bottom right
			ctx.lineTo(canvas.value.width * (canvas.value.width / 1088) + 600/80, canvas.value.height * (canvas.value.height / 544) + 80); // top right
			ctx.lineTo(canvas.value.width * (canvas.value.width / 1088) - 600/80, canvas.value.height * (canvas.value.height / 544) + 80); // top left
			ctx.fill();
			ctx.closePath();
		}

		function drawPaddle() {
			ctx.beginPath();
			ctx.fillStyle = 'white';
			var data = update(player_left.x, player_left.y);
			ctx.fillRect(data.x, data.y, canvas.value.width/80, canvas.value.height/5);
			data = update(player_right.x, player_right.y);
			ctx.fillRect( data.x, data.y, canvas.value.width/80, canvas.value.height/5);     
			ctx.fill();
			ctx.closePath();
			
		}

		function drawBall() {
			ctx.fillStyle = 'white';
			var data = update(ball.x, ball.y);
			ctx.arc(data.x, data.y, canvas.value.width/100 , 0, Math.PI * 2, false);
			ctx.fill();
		}

		function drawScore() {
			ctx.font = '1rem Courier New';
			ctx.textAlign = 'left';
			ctx.fillText("Score1 : ", canvas.value.width/2 - canvas.value.width/2.5, canvas.value.width/10);
			ctx.fillText(player_left.score.toString(), canvas.value.width/2 - canvas.value.width/8, canvas.value.width/10);

			ctx.fillText("Score2 :", canvas.value.width/2 + canvas.value.width/10, canvas.value.width/10);
			ctx.fillText(player_right.score.toString(), canvas.value.width/2 + canvas.value.width/2.5, canvas.value.width/10);
		}

		return { canvas }
	},
})
</script>

<style></style>