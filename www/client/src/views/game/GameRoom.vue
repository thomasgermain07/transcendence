<template>
	<div>
		<div v-if="state.isLoading">Loading ...</div>
		<div v-else-if="state.error">
			<p></p>
			{{ state.error }}
		</div>
		<div v-else>
			<div class="game-room">
				<PlayersDisplay
					:players="room?.players"
					:roomState="room?.state"
					:roomMode="room?.mode"
				/>
				<div class="game-ready" v-if="isPlayerWaiting">
					<GameButton
						v-bind:class="{ active: state.isActive }"
						@click="onReady"
						:colorStyle="'#6ded8a'"
						>Ready</GameButton
					>
					<div class="success" v-bind:class="{ active: state.isActive }">
						<p>Match will start once both players are ready</p>
					</div>
				</div>
				<GameButton
					v-if="state.currentPlayer?.isPause && isPause"
					@click="offPause()"
					:colorStyle="'#6ded8a'"
					>Resume</GameButton
				>
				<GameBoard
					v-if="room?.state == 'playing' || room?.state == 'pause'"
					:roomName="roomName"
					:isPlayer="!isWatching"
					:roomState="room?.state"
					:timer="timer"
				/>

				<GameButton
					v-if="isPlayerWaiting && room?.mode != 'private'"
					@click="onLeave('leaveRoom')"
					:colorStyle="'#ed3833'"
					>Quit</GameButton
				>
				<GameButton
					v-if="isPlaying"
					@click="onLeave('giveUpRoom')"
					:colorStyle="'#ed3833'"
					>Give Up</GameButton
				>
				<GameButton
					v-if="isOver"
					@click="onLeave('goBackRoom')"
					:colorStyle="'#ed3833'"
					>Go Back</GameButton
				>
				<GameButton
					v-if="isWatching"
					@click="onLeave('leaveStream')"
					:colorStyle="'#1645f5'"
					>Leave Stream</GameButton
				>
				<GameButton v-if="isPrivate" @click="onCancel" :colorStyle="'#ed3833'"
					>Cancel</GameButton
				>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted, ref } from 'vue';

import {
	useRoute,
	useRouter,
	onBeforeRouteLeave,
	onBeforeRouteUpdate,
} from 'vue-router';
import useGameRoom from '../../composables/Game/useGameRoom';

import PlayersDisplay from '../../components/game/PlayersDisplay.vue';
import GameBoard from '../../components/game/GameBoard.vue';
import GameButton from '../../components/game/GameButton.vue';

import { GameState, Room, GameMode } from '../../types/game/gameRoom';
import { useSocket } from '../../composables/socket';
import { AxiosErrType, useAxios } from '../../composables/axios';
import { Player } from '../../types/game/player';
import { useAuth } from '../../composables/auth';

export default defineComponent({
	name: 'game-room',
	components: { PlayersDisplay, GameButton, GameBoard },

	setup() {
		const route = useRoute();
		const router = useRouter();
		const { user } = useAuth();
		const {
			state,
			room,
			loadRoom,
			toastOppLeaving,
			toastGameCanceled,
			redirectToGameView,
		} = useGameRoom();

		const { axios } = useAxios();

		const roomName = ref(`room-${route.params.id}`);
		const gameRoomsSocket = useSocket('game-rooms').socket;
		const inGame = ref(false);
		let timer = ref('');

		// --- FETCH ---
		loadRoom(route?.params?.id);

		// --- COMPUTED ---
		const isPlayerWaiting = computed(() => {
			if (room?.value?.state == GameState.WAITING)
				return state.currentPlayer ? true : false;
			return false;
		});

		const isPlaying = computed(() => {
			if (state.currentPlayer) {
				return room?.value?.state == GameState.PLAYING ? true : false;
			}
			return false;
		});

		const isPause = computed(() => {
			if (state.currentPlayer) {
				return room?.value?.state == GameState.PAUSE ? true : false;
			}
			return false;
		});

		const isWatching = computed(() => {
			return state.currentPlayer == null ? true : false;
		});

		const isOver = computed(() => {
			if (state.currentPlayer)
				return room?.value?.state == GameState.OVER ? true : false;
			return false;
		});

		const isPrivate = computed(() => {
			if (
				room?.value?.state == GameState.WAITING &&
				room?.value?.mode == GameMode.PRIVATE
			)
				return state.currentPlayer ? true : false;
			return false;
		});

		const onCancel = async (): Promise<void> => {
			try {
				const res = await useAxios().axios.delete('game/rooms/private', {
					data: { room: room?.value },
				});
			} catch (err: AxiosErrType) {}
			gameRoomsSocket.emit('cancelRoom', {
				room: roomName.value,
			});
		};

		const onReady = async (): Promise<void> => {
			state.isActive = true;
			try {
				const res = await axios.put('game/players/isReady', {
					player: state.currentPlayer,
					value: true,
				});
				checkReady(res.data.room);
			} catch (e: AxiosErrType) {}
		};

		const offPause = (): void => {
			gameRoomsSocket.emit('stopPause', {
				playerId: state?.currentPlayer?.id,
				roomId: room?.value?.id,
				room: roomName.value,
			});
		};

		const onLeave = (leaveType: string): void => {
			gameRoomsSocket.emit(
				leaveType,
				{
					playerId: state?.currentPlayer?.id,
					room: roomName.value,
				},
				(message: string) => {
					router.push('/game');
				},
			);
		};

		// --- HELPER FUNCTIONS ---
		const checkIfInGame = async (roomIdFromRoute: string): Promise<void> => {
			inGame.value = false
			const res = await axios
				.get(`game/players/checkIfInGameOrQueue/${user.id}`)
				.catch((e: AxiosErrType) => {});
			if (res) {
				if (
					res.data.inGame &&
					res.data.player?.room?.id != parseInt(roomIdFromRoute)
				) {
					inGame.value = true;
				}
			}
		};

		const joinRoom = (roomIdFromRoute: string): void => {
			gameRoomsSocket.emit(
				'joinRoom',
				parseInt(roomIdFromRoute),
			);
		};

		const updateRoom = (updatedRoom: Room): void => {
			room.value = { ...updatedRoom };
			if (state.currentPlayer) {
				state.currentPlayer = room?.value?.players.find(
					(player: Player) => player.id == state?.currentPlayer?.id,
				) as Player;
			}
		};

		const checkReady = (room: Room): void => {
			if (room.players.every((player) => player.isReady === true)) {
				gameRoomsSocket.emit('updateRoomInServer', {
					socketRoomName: roomName.value,
					roomId: room.id,
					dto: { state: GameState.PLAYING },
				});

				// start game
				gameRoomsSocket.emit('init', {
					socketRoomName: roomName.value,
					room: room,
					players: room.players,
				});
			}
		};

		const stopPause = (room: Room): void => {
			if (room.players.every((player) => player.isPause === false)) {
				timer.value = '';
				gameRoomsSocket.emit('updateRoomInServer', {
					socketRoomName: roomName.value,
					roomId: room.id,
					dto: { state: GameState.PLAYING },
				});

				// start game
				gameRoomsSocket.emit('init', {
					socketRoomName: roomName.value,
					room: room,
					players: room.players,
				});
			}
		};

		const startCountDown = (counter: number): void => {
			timer.value = new Date(counter * 1000).toISOString().substr(14, 5);
		};

		// --- SOCKETS ---
		const initListeners = (): void => {
			gameRoomsSocket.on('connect', () => {
				joinRoom(route.params.id as string);
			});

			gameRoomsSocket.on('updateRoomInClient', ({ room }) => {
				updateRoom(room);
			});

			gameRoomsSocket.on('onPause', ({ count }) => {
				startCountDown(count);
			});

			gameRoomsSocket.on('checkStopPause', ({ room }) => {
				stopPause(room);
			});

			gameRoomsSocket.on('roomJoined', (roomRet) => {
				updateRoom(roomRet);
			});

			gameRoomsSocket.on('opponentLeaving', () => {
				toastOppLeaving();
				redirectToGameView();
			});

			gameRoomsSocket.on('roomCanceled', () => {
				toastGameCanceled();
				router.push('/game');
			});
		};

		onBeforeRouteUpdate(async (updateGuard) => {
			gameRoomsSocket.emit('leaveStream', {
				room: roomName.value,
			});
			loadRoom(updateGuard?.params?.id);
			await checkIfInGame(updateGuard?.params?.id as string);
			if (inGame.value === true) {
				state.error = "You can't watch a game while already in an other game";
			} else {
				initListeners();
				if (gameRoomsSocket.id) {
					joinRoom(updateGuard?.params?.id as string);
				}
				roomName.value = `room-${updateGuard?.params?.id}`;
				initListeners();
			}
		});

		onBeforeRouteLeave(async () => {
			if (state.currentPlayer && room?.value?.state == GameState.WAITING) {
				try {
					await axios.put('game/players/isReady', {
						player: state.currentPlayer,
						value: false,
					});
				} catch (e: AxiosErrType) {}
			}
		});

		onMounted(async () => {
			await checkIfInGame(route?.params?.id as string);
			if (inGame.value === true) {
				state.error = "You can't watch a game while already in an other game";
			} else {
				initListeners();
				if (gameRoomsSocket.id) {
					joinRoom(route?.params?.id as string);
				}
			}
		});

		onUnmounted(() => {
			gameRoomsSocket.off();
		});

		return {
			route,
			state,
			room,
			timer,
			roomName,
			isPlayerWaiting,
			isPlaying,
			isOver,
			isPause,
			isWatching,
			onReady,
			onLeave,
			offPause,
			isPrivate,
			onCancel,
		};
	},
});
</script>

<style scoped>
.game-ready {
	position: relative;
	margin: 20px;
}

.game-ready .game-button {
	opacity: 100%;
	transition: all 0.1s ease-out;
}

.success {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	color: #7fbe61;
	z-index: 1;
	visibility: hidden;
	transition-duration: 2s;
	opacity: 0%;
	font-family: 'Inconsolata', monospace;
	font-weight: 800;
	font-size: 16px;
}

.game-ready .game-button.active {
	visibility: hidden;
	opacity: 0%;
}

.success.active {
	visibility: visible;
	opacity: 100%;
}
</style>
