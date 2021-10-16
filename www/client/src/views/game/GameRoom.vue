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
          :players="room.players"
          :roomState="room.state"
          :roomMode="room.mode"
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
          v-if="room.state == 'playing' || room.state == 'pause'"
          :roomName="roomName"
          :isPlayer="!isWatching"
          :roomState="room.state"
          :timer="timer"
        />

        <GameButton
          v-if="isPlayerWaiting && room.mode != 'private'"
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
import { defineComponent, computed, onMounted, onUnmounted, ref } from 'vue'

import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import useGameRoom from '../../composables/Game/useGameRoom'

import PlayersDisplay from '../../components/game/PlayersDisplay.vue'
import GameBoard from '../../components/game/GameBoard.vue'
import GameButton from '../../components/game/GameButton.vue'

import { GameState, Room, GameMode } from '../../types/game/gameRoom'
import { useSocket } from '../../composables/socket'
import { AxiosErrType, useAxios } from '../../composables/axios'
import { Player } from '../../types/game/player'

export interface IGameState {
  status: string
  difficulty: string
  mode: string
  powerUps: boolean
  begin: boolean
  map: string
  count: number
}
export interface IBonusState {
  x: number
  y: number
  rayon: number
  exist: boolean
}

export default defineComponent({
  name: 'game-room',
  components: { PlayersDisplay, GameButton, GameBoard },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const {
      state,
      room,
      loadRoom,
      toastOppLeaving,
      toastGameCanceled,
      redirectToGameView,
    } = useGameRoom()

    const roomName = `room-${route.params.id}`
    const gameRoomsSocket = useSocket('game-rooms').socket

    let timer = ref('')
    // --- FETCH ---
    loadRoom(route.params.id)

    // --- COMPUTED ---
    const isPlayerWaiting = computed(() => {
      if (room.value.state == GameState.WAITING)
        return state.currentPlayer ? true : false
      return false
    })

    const isPlaying = computed(() => {
      if (state.currentPlayer)
        return room.value.state == GameState.PLAYING ? true : false
      return false
    })

    const isPause = computed(() => {
      if (state.currentPlayer) {
        return room.value.state == GameState.PAUSE ? true : false
      }
      return false
    })

    const isWatching = computed(() => {
      return state.currentPlayer == null ? true : false
    })

    const isOver = computed(() => {
      if (state.currentPlayer)
        return room.value.state == GameState.OVER ? true : false
      return false
    })

    const isPrivate = computed(() => {
      if (
        room.value.state == GameState.WAITING &&
        room.value.mode == GameMode.PRIVATE
      )
        return state.currentPlayer ? true : false
      return false
    })

    const onCancel = async () => {
      try {
        const res = await useAxios().axios.delete('game/rooms/private', {
          data: { room: room.value },
        })
      } catch (err: AxiosErrType) {
        console.log(err.response?.data?.message)
      }
      gameRoomsSocket.emit('cancelRoom', {
        room: roomName,
      })
    }

    const onReady = (): void => {
      state.isActive = true
      gameRoomsSocket.emit('getReady', {
        playerId: state.currentPlayer.id,
        room: roomName,
      })
    }

    const offPause = (): void => {
      gameRoomsSocket.emit('stopPause', {
        playerId: state.currentPlayer.id,
        roomId: room.id,
        room: roomName,
      })
    }

    const onLeave = (leaveType: string): void => {
      gameRoomsSocket.emit(
        leaveType,
        {
          playerId: state?.currentPlayer?.id,
          room: roomName,
        },
        (message: string) => {
          router.push('/game')
        },
      )
    }

    // --- HELPER FUNCTIONS ---
    const joinRoom = (): void => {
      gameRoomsSocket.emit(
        'joinRoom',
        parseInt(route.params.id),
        (message: string) => console.log(message),
      )
    }

    const updateRoom = (updatedRoom: Room): void => {
      room.value = { ...updatedRoom }
      if (state.currentPlayer) {
        state.currentPlayer = room.value.players.find(
          (player: Player) => player.id == state.currentPlayer.id,
        )
      }
    }

    // check if both players are ready
    const checkReady = (room: Room): void => {
      if (room.players.every((player) => player.isReady === true)) {
        // update Room state to playing
        gameRoomsSocket.emit('updateRoomInServer', {
          socketRoomName: roomName,
          roomId: room.id,
          dto: { state: GameState.PLAYING },
        })

        // start game
        gameRoomsSocket.emit('init', {
          socketRoomName: roomName,
          room: room,
          players: room.players,
        })
      }
    }

    const stopPause = (room: Room): void => {
      if (room.players.every((player) => player.isPause === false)) {
        // update Room state to playing
        // clearInterval(interval)
        timer.value = 0
        gameRoomsSocket.emit('updateRoomInServer', {
          socketRoomName: roomName,
          roomId: room.id,
          dto: { state: GameState.PLAYING },
        })

        // start game
        gameRoomsSocket.emit('init', {
          socketRoomName: roomName,
          room: room,
          players: room.players,
        })
      }
    }

    const startCountDown = (counter: number) => {
      timer.value = new Date(counter * 1000).toISOString().substr(14, 5)
    }

    // --- SOCKETS ---
    gameRoomsSocket.on('connect', () => {
      joinRoom()
    })

    gameRoomsSocket.on('updateRoomInClient', ({ room }) => {
      updateRoom(room)
    })

    gameRoomsSocket.on('onPause', ({ count }) => {
      startCountDown(count)
    })

    gameRoomsSocket.on('checkReady', ({ room }) => {
      checkReady(room)
    })

    gameRoomsSocket.on('checkStopPause', ({ room }) => {
      stopPause(room)
    })

    gameRoomsSocket.on('roomJoined', (roomRet) => {
      updateRoom(roomRet)
    })

    gameRoomsSocket.on('opponentLeaving', () => {
      toastOppLeaving()
      redirectToGameView()
    })

    gameRoomsSocket.on('roomCanceled', () => {
      toastGameCanceled()
      router.push('/game')
    })

    onBeforeRouteLeave(() => {
      if (state.currentPlayer && room.value.state == GameState.WAITING) {
        gameRoomsSocket.emit('notReady', {
          playerId: state.currentPlayer.id,
        })
      }
    })

    onMounted(() => {
      if (gameRoomsSocket.id) {
        joinRoom()
      }
    })

    onUnmounted(() => {
      gameRoomsSocket.off()
    })

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
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap');

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
