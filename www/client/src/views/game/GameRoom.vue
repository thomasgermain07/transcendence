<template>
  <div>
    <div v-if="state.isLoading">Loading ...</div>
    <div v-else-if="state.error">
      <p></p>
      {{ state.error }}
    </div>
    <div v-else>
      <div class="game-room">
        <PlayersDisplay :players="room.players" :roomState="room.state" />
        <!-- @checkReady="onReady" -->
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

        <GameBoard
          v-if="room.state == 'playing'"
          :roomName="roomName"
          :isPlayer="!isWatching"
        />

        <GameButton
          v-if="isPlayerWaiting"
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

import { GameState, Room } from '../../types/game/gameRoom'
import { useSocket } from '../../composables/socket'

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
    const { state, room, loadRoom } = useGameRoom()

    const roomName = `room-${route.params.id}`
    const gameRoomsSocket = useSocket('game-rooms').socket

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

    const isWatching = computed(() => {
      return state.currentPlayer == null ? true : false
    })

    const isOver = computed(() => {
      if (state.currentPlayer)
        return room.value.state == GameState.OVER ? true : false
      return false
    })

    const onReady = (): void => {
      console.log(`Player ${state.currentPlayer.id} READY`)
      state.isActive = true
      gameRoomsSocket.emit('getReady', {
        playerId: state.currentPlayer.id,
        room: roomName,
      })
    }

    const onLeave = (leaveType: string): void => {
      console.log(leaveType)
      gameRoomsSocket.emit(
        leaveType,
        {
          playerId: state?.currentPlayer?.id,
          room: roomName,
        },
        (message) => {
          console.log(message)
          router.push('/game')
        },
      )
    }

    // --- HELPER FUNCTIONS ---
    const joinRoom = (): void => {
      console.log('in join room function ')
      gameRoomsSocket.emit(
        'joinRoom',
        parseInt(route.params.id),
        (message: string) => console.log(message),
      )
    }

    const updateRoom = (updatedRoom: Room): void => {
      room.value = { ...updatedRoom }
    }

    // check if both players are ready
    const checkReady = (room: Room): void => {
      if (room.players.every((player) => player.isReady === true)) {
        console.log('Both players are ready')

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

    // --- SOCKETS ---
    gameRoomsSocket.on('connect', () => {
      console.log('game-room socket connected')
      console.log(gameRoomsSocket.id)
      joinRoom()
    })
    gameRoomsSocket.io.on('reconnect', () => {
      console.log('reconnected')
    })
    gameRoomsSocket.on('disconnect', () => {
      console.log(`disconnected game-room`)
      // gameRoomsSocket.off()
    })

    gameRoomsSocket.on('updateRoomInClient', ({ room }) => {
      console.log(`in update room`)
      console.log(room)
      updateRoom(room)
    })

    gameRoomsSocket.on('checkReady', ({ room }) => {
      console.log(`in check ready`)
      checkReady(room)
    })

    gameRoomsSocket.on('roomJoined', (roomRet) => {
      console.log('someone joined the room ' + roomName)
      updateRoom(roomRet)
    })

    gameRoomsSocket.on('opponentLeaving', () => {
      console.log('someone left the room')
      // TODO: change alert to custom notif toast
      alert(
        'The other player left the game room - you will be redirected to the game view',
      )
      // onLeave('leaveRoom') // router.push .. to put back in matchmaking queue
      room.value.mode === 'duel'
        ? router.push('/game/duel')
        : router.push('/game/ladder')
    })

    onBeforeRouteLeave(() => {
      if (state.currentPlayer && room.value.state == GameState.WAITING) {
        gameRoomsSocket.emit('notReady', {
          playerId: state.currentPlayer.id,
        })
      }
    })

    onMounted(() => {
      console.log('In mount game-room')
      console.log(gameRoomsSocket.id)
      if (gameRoomsSocket.id) {
        joinRoom()
      }
    })

    onUnmounted(() => {
      console.log('In unmount - gameRooms Socket.off')
      gameRoomsSocket.off()
      // leave room ?
    })

    return {
      route,
      state,
      room,
      roomName,
      isPlayerWaiting,
      isPlaying,
      isOver,
      isWatching,
      onReady,
      onLeave,
    }
  },
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap");

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
  font-family: "Inconsolata", monospace;
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
