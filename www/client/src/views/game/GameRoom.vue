<template>
  <div>
    <div v-if="state.isLoading">Loading ...</div>
    <div v-else-if="state.error">
      {{ state.error.response.data.message }}
    </div>
    <div v-else>
      <h1>Game Room {{ route.params.id }}</h1>
      <p>Current user: {{ currentUser }}</p>
      <div class="game-info" v-if="room">
        <h3>Game Info</h3>
        <p>
          Mode: {{ room.mode }} - State: {{ room.state }} - Locked:
          {{ room.locked }}
        </p>
        <p>
          Options: {{ room.option.map }} - {{ room.option.difficulty }} -
          {{ room.option.powerUps }}
        </p>
      </div>
      <PlayersDisplay :players="room.players" />
      <div class="game-ready" v-if="isPlayer">
        <button
          class="btn"
          v-bind:class="{ active: state.isActive }"
          @click="onReady"
        >
          Ready
        </button>
        <div class="success" v-bind:class="{ active: state.isActive }">
          <p>Match will start once both players are ready</p>
        </div>
      </div>

      <canvas></canvas>

      <button v-if="isPlayer" @click="onLeave">Leave Game Room</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { io } from 'socket.io-client'

import PlayersDisplay from '../../components/Game/PlayersDisplay.vue'
import useGameRoom from '../../composables/Game/useGameRoom'
import { GameState, Room } from '../../types/game/gameRoom'

const gameRoomsSocket = io('ws://localhost:8080/game-rooms')

export default defineComponent({
  name: 'GameRoom',
  components: { PlayersDisplay },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { state, room, loadRoom } = useGameRoom()

    const currentUser = store.state.user
    const roomName = `room-${route.params.id}`

    // Fetching game room
    loadRoom(route.params.id)

    const isPlayer = computed(() => {
      return state.currentPlayer ? true : false
    })

    // --- ACTIONS ---
    const onReady = (): void => {
      console.log(`Player ${state.currentPlayer.id} READY`)
      state.isActive = true
      gameRoomsSocket.emit('getReady', {
        playerId: state.currentPlayer.id,
        room: roomName,
      })
    }

    const onLeave = (): void => {
      console.log(
        `User ${currentUser.id} - player ${state.currentPlayer.id} will leave game`,
      )
      gameRoomsSocket.emit(
        'leaveRoom',
        {
          playerId: state.currentPlayer.id,
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
      gameRoomsSocket.emit('joinRoom', roomName, (message: string) =>
        console.log(message),
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
      console.log(`disconnected`)
    })

    gameRoomsSocket.on('updateRoomInClient', ({ room }) => {
      console.log(`in update room`)
      updateRoom(room)
    })

    gameRoomsSocket.on('checkReady', ({ room }) => {
      console.log(`in check ready`)
      checkReady(room)
    })

    gameRoomsSocket.on('roomJoined', () => {
      console.log('someone joined the room ' + roomName)
      loadRoom(route.params.id)
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
      store,
      state,
      room,
      currentUser,
      isPlayer,
      onReady,
      onLeave,
    }
  },
})
</script>

<style>
.game-ready {
  position: relative;
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
}

.btn span {
  visibility: visible;
}

.btn.active {
  visibility: hidden;
}

.success.active {
  visibility: visible;
}

.btn.active span {
  visibility: hidden;
}
</style>
