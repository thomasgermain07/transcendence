<template>
  <div>
    <div v-if="state.isLoading">Loading ...</div>
    <div v-else-if="state.error">
      {{ state.error }}
    </div>
    <div v-else>
      <GameLobby
        :room="room"
        :isMatched="state.isMatched"
        v-if="state.isModalVisible"
        @close="closeModal"
        @leaveLobby="onLeave('leaveRoom')"
      >
        <template v-slot:header> Hi {{ currentUser.name }} </template>

        <!-- <template v-slot:body>
          Looking for player 
        </template> -->
        <!-- 
        <template v-slot:footer>
          This is a new modal footer.
        </template> -->
      </GameLobby>

      <div class="game-room" v-if="state.isRoomVisible">
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
        <!-- @checkReady="onReady" -->
        <div class="game-ready" v-if="isPlayerReady">
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

        <GameBoard
          v-if="room.state == 'playing'"
          :roomName="roomName"
          :isPlayer="!isWatching"
        />

        <button v-if="isPlayerReady" @click="onLeave('leaveRoom')">
          Leave Game Room
        </button>
        <button v-if="isPlaying" @click="onLeave('giveUpRoom')">Give Up</button>
        <button v-if="isOver" @click="onLeave('goBackRoom')">Go Back</button>
        <button v-if="isWatching" @click="onLeave('leaveStream')">
          Leave Stream
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, onUnmounted } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import useSockets from '../store/sockets'
import useGameRoom from '../composables/Game/useGameRoom'

import PlayersDisplay from '../components/Game/PlayersDisplay.vue'
import GameLobby from '../components/Game/MatchmakingLobby.vue'
import GameBoard from '../components/Game/GameBoard.vue'

import { GameState, Room } from '../types/game/gameRoom'

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
  name: 'GameRoom',
  components: { PlayersDisplay, GameLobby, GameBoard },

  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { state, room, loadRoom } = useGameRoom()
    const currentUser = store.state.user
    const roomName = `room-${route.params.id}`
    const { gameRoomsSocket } = useSockets()

    // --- FETCH ---
    loadRoom(route.params.id)

    // --- COMPUTED ---
    const isPlayerReady = computed(() => {
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

    // --- EVENTS ACTIONS ---
    const closeModal = () => {
      state.isModalVisible = false
      state.isRoomVisible = true
    }

    const onReady = (): void => {
      console.log(`Player ${state.currentPlayer.id} READY`)
      state.isActive = true
      gameRoomsSocket.emit('getReady', {
        playerId: state.currentPlayer.id,
        room: roomName,
      })
    }

    const onLeave = (leaveType: string): void => {
      console.log(`User ${currentUser.id} - will leave game`)
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
      // gameRoomsSocket.emit('joinRoom', roomName, (message: string) =>
      gameRoomsSocket.emit(
        'joinRoom',
        parseInt(route.params.id),
        (message: string) => console.log(message),
      )
    }

    const updateRoom = (updatedRoom: Room): void => {
      room.value = { ...updatedRoom }
      // TODO: if state waiting and room not locked
      // -> notif user that other player left room
      // and remove user from room (call onLeave('leaveRoom'))
      if (updatedRoom.locked === false) {
        // console.log(updatedRoom.locked)
        state.isMatched = false
        state.isModalVisible = true
        // isModalVisible.value = true
      }
    }

    const updateState = (newState: boolean): void => {
      console.log('updating matched state ' + newState)
      state.isMatched = newState
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
      updateRoom(room)
    })

    gameRoomsSocket.on('checkReady', ({ room }) => {
      console.log(`in check ready`)
      checkReady(room)
    })

    gameRoomsSocket.on('roomJoined', (roomRet) => {
      console.log('someone joined the room ' + roomName)
      updateRoom(roomRet)
      updateState(true)
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
      roomName,
      currentUser,
      isPlayerReady,
      isPlaying,
      isOver,
      isWatching,
      onReady,
      onLeave,
      closeModal,
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
