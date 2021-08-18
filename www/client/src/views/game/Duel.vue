<template>
  <div class="duel-game">
    <GameLobby
      v-if="lobby.visible"
      :gameMode="'duel'"
      :matchFound="lobby.matched"
      @close="leaveLobby"
      @renewSearchDuel="renewSearch"
      @redirect-to-game-room="goToRoom"
    >
      <template v-slot:header> Hi {{ currentUser.name }} </template>
      <template v-slot:body>
        <h3>Room Options:</h3>
        <p>Map : {{ lobby.player.room.option.map }}</p>
        <p>Level: {{ lobby.player.room.option.difficulty }}</p>
        <p>Addons: {{ lobby.player.room.option.powerUps }}</p>
      </template>
    </GameLobby>
    <div class="in-game" v-if="checkInGame.inGame">
      <h4>Player is already in game</h4>
      <router-link :to="checkInGame.roomRoute">Go to game room</router-link>
    </div>
    <div class="play-duel-game">
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
        <br />
        <img
          v-if="duelOptions.map == 'default'"
          src="../../assets/images/mapDefault.png"
        />
        <img
          v-else-if="duelOptions.map == 'map1'"
          src="../../assets/images/map1.png"
        />
        <img
          v-else-if="duelOptions.map == 'map2'"
          src="../../assets/images/map2.png"
        />
        <button>Play Duel</button>
      </form>
    </div>
    <h3>Duel Stream</h3>
    <WatchRooms :rooms="rooms" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  DifficultyLevel,
  GameOptions,
  MapType,
} from '../../types/game/gameOptions'
import { Player } from '../../types/game/player'
import { GameMode, Room } from '../../types/game/gameRoom'
import GameLobby from '../../components/game/MatchmakingLobby.vue'
import WatchRooms from '../../components/game/WatchRooms.vue'
import useAllGameRoom from '../../composables/Game/useAllGameRoom'
import useMatchmaker from '../../composables/Game/useMatchmaker'
import useSockets from '../../store/sockets'
import { useAuth } from '../../composables/auth'

export default defineComponent({
  name: 'game-duel',
  components: { WatchRooms, GameLobby },
  setup() {
    const { user } = useAuth()
    const currentUser = user

    const { rooms, loadGameRooms } = useAllGameRoom('duel')

    const { matchmakingSocket, gameRoomsSocket } = useSockets()
    const {
      lobby,
      roomName,
      checkInGame,
      checkIfInGameOrQueue,
      updateMatchedState,
      joinLobby,
      leaveLobby,
      goToRoom,
      renewSearch,
      playGame,
    } = useMatchmaker()

    loadGameRooms()

    // options can be changed for Duel only
    const duelOptions: GameOptions = reactive({
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    })

    const onPlayDuel = (): void => {
      playGame(GameMode.DUEL, duelOptions)
    }

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      loadGameRooms()
      rooms.value = { ...updatedRoom }
    }

    // --- SOCKETS LISTENERS ---
    matchmakingSocket.on('connect', () => {
      console.log('connected')
      console.log(matchmakingSocket.id)
    })
    matchmakingSocket.io.on('reconnect', () => {
      console.log('reconnected')
      console.log(matchmakingSocket.id)
    })
    matchmakingSocket.on('disconnect', () => {
      console.log(`disconnected`)
    })
    matchmakingSocket.on('exception', (err) => {
      console.log('IN EXCEPTION')
      console.log(err)
    })

    matchmakingSocket.on('joinLobbyInClient', (player: Player) => {
      console.log('Joining lobby')
      joinLobby(player)
    })

    matchmakingSocket.on('matchFound', () => {
      console.log('Match found')
      updateMatchedState(true)
    })

    // For inactive users
    // matchmakingSocket.on('closeLobbyModal', () => {
    //   closeLobby()
    // })

    gameRoomsSocket.on('updateWatchRoomInClient', ({ rooms }) => {
      console.log(`in update Watch room`)
      console.log(rooms)
      updateWatchRooms(rooms)
    })

    // --- NAVIGATION GUARDS ---
    onBeforeRouteLeave((to, from) => {
      if (lobby.visible) {
        const answer = window.confirm(
          'Do you really want to leave? You will be removed from the queue!',
        )
        // cancel the navigation and stay on the same page
        if (!answer) {
          return false
        } else {
          leaveLobby()
        }
      }
    })

    // --- LIFECYCLE HOOKS ---
    onMounted(() => {
      console.log('In mount matchmaker - socket id: ' + matchmakingSocket.id)
      checkIfInGameOrQueue()
    })

    onUnmounted(() => {
      console.log('In unmount - matchmaker matchmakingSocket.off')
      if (roomName.value) {
        matchmakingSocket.emit('leaveLobbySocket', {
          room: roomName.value,
        })
      }
      matchmakingSocket.off() // -> could be problematic between vues
      // gameRoomsSocket.off() ????
    })

    return {
      checkInGame,
      duelOptions,
      onPlayDuel,
      rooms,
      currentUser,
      lobby,
      leaveLobby,
      goToRoom,
      renewSearch,
    }
  },
})
</script>

<style scoped>
/* @import url('http://fonts.cdnfonts.com/css/pixelfaceonfire');
@import url('http://fonts.cdnfonts.com/css/messing-lettern');
@import url('http://fonts.cdnfonts.com/css/gun-metal'); */
@import url('http://fonts.cdnfonts.com/css/karmatic-arcade');

.duel-game {
  height: 100%;
  /* width: max-content; */
  min-width: fit-content;
  font-size: 200%;
  /* background-size: 30%; */
  background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 0, 0.5),
      rgba(0, 0, 255, 0.5)
    ),
    url('../../assets/images/vs.png');
  background-position: center;
  background-size: 30%;
  padding: 30px;
  /* text-shadow: 1px 1px 2px pink; */
  text-shadow: pink 0.1em 0.1em 0.2em;
  /* font-family: 'PixelFaceOnFire', sans-serif; */
  /* font-family: 'Messing Lettern', sans-serif; */
  /* font-family: 'Gunmetal', sans-serif; */
  color: #000000;

  font-family: 'Karmatic Arcade', sans-serif;
}

.geme-mode a {
  margin: 50% auto;
}

.duel-game .play-duel-game form {
  max-width: 70%;
  margin: 30px auto;
  background: rgba(0, 0, 255, 0.2);
  text-align: center;
  padding: 40px;
  border-radius: 10px;
}
.duel-game .play-duel-game img {
  max-width: 70%;
  margin: 30px auto;
}

label {
  /* color: #848482; */
  color: #000000;
  display: inline-block;
  margin: 10px 0 15px;
  padding: 0 20px;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
  /* font-family: 'PixelFaceOnFire', sans-serif; */
  /* font-family: 'Messing Lettern', sans-serif; */
  /* font-family: 'Gunmetal', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;
}

select {
  display: inline-block;
  margin: auto;
  text-align: center;
  padding: 8px 4px;
  box-sizing: border-box;
  border: none;
  border-bottom: 0px solid #ddd;
  color: #f1f1f1;
  background: #000000;
}

button {
  display: block;
  background: #0a0a0a;
  border: none;
  margin: 20px auto 0;
  padding: 0.7em;
  color: #f1f1f1;
  font-size: 0.8em;

  /* font-family: 'PixelFaceOnFire', sans-serif; */
  /* font-family: 'Messing Lettern', sans-serif; */
  /* font-family: 'Gunmetal', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;
}

button:hover {
  background: #aa6bdd;
}

/* hr {
  width: 40%;
  margin: 50px auto;

} */

.in-game a {
  color: hotpink;
  font-size: 2rem;
}
</style>
