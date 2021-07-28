<template>
  <div class="ladder-game">
		<div class="in-game" v-if="checkInGame.inGame">
      <h4>Player is already in game</h4>
      <router-link :to="checkInGame.roomRoute">Go to game room</router-link>
    </div>
    <div class="play-ladder-game">
      <button @click="onPlayLadder">Play Ladder</button>  
    </div>
		<h3>Ladder Stream</h3>
    <WatchRooms :rooms="rooms" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { InGameType } from '../types/game/game'
import {
  DifficultyLevel,
  GameOptions,
  MapType,
} from '../types/game/gameOptions'
import { GameMode, Room } from '../types/game/gameRoom'
import useAllGameRoom from '../composables/Game/useAllGameRoom'
import { Player } from '../types/game/player'
import WatchRooms from '../components/Game/WatchRooms.vue'
import useSockets from '../store/socket'


export default defineComponent({
  name: 'Ladder',
	components: { WatchRooms },

  setup() {
    const router = useRouter()
    const store = useStore()
    const currentUser = store.state.user
		const {rooms, loadGameRooms} = useAllGameRoom("ladder")
		const { matchmakingSocket, gameRoomsSocket } = useSockets()

    loadGameRooms();

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      rooms.value = { ...updatedRoom }
    }
    // check if user is already in Game Room
    const checkInGame: InGameType = reactive({
      inGame: false,
      roomRoute: '',
    })

    const onPlayLadder = (): void => {
      playGame(GameMode.LADDER, null)
    }

    const playGame = (mode: GameMode, options: GameOptions | null): void => {
      matchmakingSocket.emit(
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
    matchmakingSocket.on('connect', () => {
      console.log('connected')
      console.log(matchmakingSocket.id)
    })
    matchmakingSocket.io.on('reconnect', () => {
      console.log('reconnected')
    })
    matchmakingSocket.on('disconnect', () => {
      console.log(`disconnected`)
    })
    matchmakingSocket.on('exception', (err) => {
      console.log('IN EXCEPTION')
      console.log(err)
    })

    matchmakingSocket.on('redirect-to-room', (roomId) => {
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
      console.log(matchmakingSocket.id)
      matchmakingSocket.emit('checkInGame', currentUser, (message: InGameType) => {
        console.log(message)
        checkInGame.inGame = message.inGame
        checkInGame.roomRoute = message.roomRoute
      })
    })

    onUnmounted(() => {
      console.log('In unmount - matchmaker matchmakingSocket.off')
      matchmakingSocket.off()
    })

    return { checkInGame, onPlayLadder, rooms, GameMode }
  },
})
</script>

<style>
.geme-mode a{
  margin: 50% auto;
}
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

.panel-v.left {
  position: static;
  float: left;
  height: 100%;
}
.panel-v.right {
  position: static;
  float: right;
  height: 100%;
}

.line-vertical {
  border-left: 4px solid black; 
  height: 300px; 
  display: block;
  margin-left: auto;
  margin-right: auto;
}

</style>
