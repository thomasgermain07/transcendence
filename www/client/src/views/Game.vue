<template>
  <div class="game">
    <h1>Game View</h1>
    <div class="in-game" v-if="checkInGame.inGame">
      <h4>Player is already in game</h4>
      <router-link :to="checkInGame.roomRoute">Go to game room</router-link>
    </div>
    <div class="game-selection">
      <h2>Duel Game</h2>
      <form @submit.prevent="onPlayDuel">
        <label>Map</label>
        <select v-model="duelOptions.map">
          <option value="default">Default Map</option>
          <option value="map1">Map 1</option>
          <option value="map2">Map 2</option>
        </select>
        <label>Difficulty</label>
        <select v-model="duelOptions.difficulty">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label>Power-Ups</label>
        <select v-model="duelOptions.powerUps">
          <option :value="true">Yes</option>
          <option :value="false">No</option>
        </select>
        <button>Play Duel</button>
      </form>
      <hr />
      <h2>Ladder Game</h2>
      <button @click="onPlayLadder">Play Ladder</button>
      <WatchRooms :rooms="rooms" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { io } from 'socket.io-client'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { InGameType } from '../types/game/game'
import {
  DifficultyLevel,
  GameOptions,
  MapType,
} from '../types/game/gameOptions'
import { GameMode, Room } from '../types/game/gameRoom'
import WatchRooms from '../components/Game/WatchRooms.vue'

// import axios from 'axios'
// import { GameState, Room } from '../types/game/gameRoom'
import useAllGameRoom from '../composables/Game/useAllGameRoom'
import { Player } from '../types/game/player'
const socket = io('ws://localhost:8080/matchmaker')
const gameRoomsSocket = io('ws://localhost:8080/game-rooms')

export default defineComponent({
  name: 'Game',
  components: { WatchRooms },

  setup() {
    const router = useRouter()
    const store = useStore()
    const currentUser = store.state.user

    const { rooms, loadGameRooms } = useAllGameRoom()
    loadGameRooms()

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      rooms.value = { ...updatedRoom }
    }
    // console.log(tmp);
    // console.log(rooms.value);

    // check if user is already in Game Room
    const checkInGame: InGameType = reactive({
      inGame: false,
      roomRoute: '',
    })

    // options can be changed for Duel only
    const duelOptions: GameOptions = {
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    }

    const onPlayDuel = (): void => {
      playGame(GameMode.DUEL, duelOptions)
    }

    const onPlayLadder = (): void => {
      playGame(GameMode.LADDER, null)
    }

    const playGame = (mode: GameMode, options: GameOptions | null): void => {
      socket.emit(
        'searchMatch',
        {
          user: currentUser,
          mode: mode,
          options: options,
        },
        (player: Player) => {
          alert(`${player.user.name} already in Game`)
        },
      )
    }

    // --- SOCKETS ---
    socket.on('connect', () => {
      console.log('connected')
      console.log(socket.id)
    })
    socket.io.on('reconnect', () => {
      console.log('reconnected')
    })
    socket.on('disconnect', () => {
      console.log(`disconnected`)
    })
    socket.on('exception', (err) => {
      console.log('IN EXCEPTION')
      console.log(err)
    })

    socket.on('redirect-to-room', (roomId) => {
      console.log(`Redirection to room ${roomId}`)
      router.push(`/game/room/${roomId}`)
    })

    gameRoomsSocket.on('updateWatchRoomInClient', ({ rooms }) => {
      console.log(`in update Watch room`)
      updateWatchRooms(rooms)
    })

    // --- LIFEHCYCLE HOOKS ---
    onMounted(() => {
      console.log('In mount matchmaker')
      console.log(socket.id)
      socket.emit('checkInGame', currentUser.id, (message: InGameType) => {
        console.log(message)
        checkInGame.inGame = message.inGame
        checkInGame.roomRoute = message.roomRoute
      })
    })

    onUnmounted(() => {
      console.log('In unmount - matchmaker socket.off')
      socket.off()
    })

    return { checkInGame, duelOptions, onPlayDuel, onPlayLadder, rooms }
  },
})
</script>

<style>
form {
  max-width: 70%;
  margin: 30px auto;
  background: #f1f1f1;
  text-align: center;
  padding: 40px;
  border-radius: 10px;
}

label {
  color: #a7a7a7;
  display: inline-block;
  margin: 10px 0 15px;
  padding: 0 20px;
  font-size: 0.8em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}

select {
  display: inline-block;
  margin: auto;
  text-align: center;
  padding: 8px 4px;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #555;
}

button {
  display: block;
  background: #0a0a0a;
  border: none;
  margin: 20px auto 0;
  padding: 0.7em;
  color: #f1f1f1;
}

button:hover {
  background: #aa6bdd;
}

hr {
  width: 40%;
  margin: 50px auto;
}

.in-game a {
  color: hotpink;
  font-size: 2rem;
}
</style>
