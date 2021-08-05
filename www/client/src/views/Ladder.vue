<template>
  <div class="ladder-game">
		<h2>Ladder Game</h2>
		<figure class="circle"><p>LEVEL {{currentUser.ladderLevel}}</p></figure>
		<div class="in-game" v-if="checkInGame.inGame">
      <h4>Player is already in game</h4>
      <router-link :to="checkInGame.roomRoute">Go to game room</router-link>
    </div>
    <div class="play-ladder-game">
      <img src="../images/mapDefault.png">
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

    return { checkInGame, onPlayLadder, rooms, GameMode, currentUser }
  },
})
</script>

<style>
.geme-mode a{
  margin: 50% auto;
}
figure {
	display: inline-block;
	border-radius: 50%;
	height: 300px;
	width: 300px;
  max-width: 100%;
	background: radial-gradient(circle at 100px 100px, #5cabff, #000);
	/* font-size: 300%; */
  text-align: center;
	color: #000000;
	margin: 0px;
}
figure p {
  font-size: 100%;
  text-align: center;
  margin-top: 3em;
}
.ladder-game {
  /* width: 100%; */
  min-width: fit-content;
  font-size: 200%;
  /* background-size: 30%; */
	background-image: linear-gradient(to bottom, rgba(255,255,0,0.5), rgba(0,0,255,0.5)), url("../images/levelUp.png");
  background-position: center;
  /* background-size: cover; */
  background-size: 30%;
  padding: 30px;
  /* text-shadow: 1px 1px 2px pink; */
	text-shadow: pink 0.1em 0.1em 0.2em;
	/* font-family: 'PixelFaceOnFire', sans-serif; */
	/* font-family: 'Messing Lettern', sans-serif; */
	/* font-family: 'Gunmetal', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;

	color: #000000;

}
.play-ladder-game img{
  /* width: %; */
  height: auto;
  max-width: 50%;
  margin-top: 20px;
}

button {
  display: block;
  background: #0a0a0a;
  border: none;
  margin: 70px auto 0;
  padding: 0.7em;
  color: #f1f1f1;
}

button:hover {
  background: #aa6bdd;
}

.in-game a {
  color: hotpink;
  font-size: 2rem;
}
</style>
