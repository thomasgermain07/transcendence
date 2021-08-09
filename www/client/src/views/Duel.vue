<template>
  <div class="duel-game">
    <GameLobby
      v-if="lobby.visible"
      :gameMode="'duel'"
      :matchFound="lobby.matched"
      @close="leaveLobby"
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
          src="../images/mapDefault.png"
        />
        <img v-else-if="duelOptions.map == 'map1'" src="../images/map1.png" />
        <img v-else-if="duelOptions.map == 'map2'" src="../images/map2.png" />
        <button>Play Duel</button>
      </form>
    </div>
    <h3>Duel Stream</h3>
    <WatchRooms :rooms="rooms" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  watch,
  ref,
  computed,
} from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { InGameType, LobbyType } from '../types/game/game'
import {
  DifficultyLevel,
  GameOptions,
  MapType,
} from '../types/game/gameOptions'
import { GameMode, Room } from '../types/game/gameRoom'
import WatchRooms from '../components/Game/WatchRooms.vue'
import useAllGameRoom from '../composables/Game/useAllGameRoom'
import { Player } from '../types/game/player'
import useSockets from '../store/sockets'
import GameLobby from '../components/Game/MatchmakingLobby.vue'

export default defineComponent({
  name: 'Duel',
  components: { WatchRooms, GameLobby },
  setup() {
    const router = useRouter()
    const store = useStore()
    const currentUser = store.state.user
    let currentMode = ref(null)
    const { rooms, loadGameRooms } = useAllGameRoom('duel')
    const { matchmakingSocket, gameRoomsSocket } = useSockets()

    loadGameRooms()

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      rooms.value = { ...updatedRoom }
      loadGameRooms()
      console.log(rooms.value)
    }

    // check if user is already in Game Room
    const checkInGame: InGameType = reactive({
      inGame: false,
      roomRoute: '',
    })

    // options can be changed for Duel only
    const duelOptions: GameOptions = reactive({
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    })

    // const checkOptions = (map: MapType): void => {
    //   duelOptions.map = map;
    //   console.log(duelOptions.)
    // }

    const onPlayDuel = (): void => {
      playGame(GameMode.DUEL, duelOptions)
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
      console.log(matchmakingSocket.id)
    })
    matchmakingSocket.on('disconnect', () => {
      console.log(`disconnected`)
    })
    matchmakingSocket.on('exception', (err) => {
      console.log('IN EXCEPTION')
      console.log(err)
    })

    // gameRoomsSocket.on('updateWatchRoomInClient', ({ rooms }) => {
    gameRoomsSocket.on('updateWatchRoomInClient', ({ rooms }) => {
      console.log(`in update Watch room`)
      console.log(rooms)
      updateWatchRooms(rooms)
    })

    // matchmakingSocket.on('redirect-to-room', (roomId) => {
    //   console.log(`Redirection to room ${roomId}`)
    //   router.push(`/game/room/${roomId}`)
    // })

    const lobby: LobbyType = reactive({
      visible: false,
      matched: false,
      player: null,
      // roomId: 0,
      // playerId: 0,
    })

    const roomName = computed(() => {
      return `lobby-${lobby.player.room.id}`
      // return `lobby-${lobby.roomId}`
    })

    // open modal
    const showLobby = () => {
      console.log('In Show Lobby')
      lobby.visible = true
    }

    // close modal
    const closeLobby = () => {
      console.log('In Close Lobby')
      lobby.visible = false
    }

    const joinLobby = (player: Player): void => {
      console.log('Join lobby from client')
      // lobby.roomId = player.room.id
      // lobby.playerId = player.id
      lobby.player = player
      console.log('Room id: ' + lobby.player.room.id)
      console.log('Room name: ' + roomName.value)
      matchmakingSocket.emit(
        'joinLobbyInServer',
        {
          roomName: roomName.value,
          roomId: lobby.player.room.id,
        },
        (message) => {
          console.log(message)
        },
      )
    }

    const leaveLobby = () => {
      console.log('In leave lobby Duel view')
      // lobbyVisible.value = false
      closeLobby()
      matchmakingSocket.emit('leaveLobbyInServer', {
        roomName: roomName.value,
        // roomId: roomId.value,
        // playerId: lobby.playerId,
        playerId: lobby.player.id,
      })
    }

    const updateMatchedState = (value: boolean) => {
      console.log('in update matched state')
      lobby.matched = value
    }

    const goToRoom = () => {
      closeLobby()
      console.log('Redirection to game room')
      console.log(lobby.player.room.id)
      router.push(`/game/room/${lobby.player.room.id}`)
    }

    const checkIfInGameOrQueue = () => {
      matchmakingSocket.emit('checkInGame', currentUser, (data: InGameType) => {
        console.log(data)
        checkInGame.inGame = data.inGame
        checkInGame.roomRoute = data.roomRoute
        // show matchmaking window if player in unlocked game room
        if (!checkInGame.inGame && checkInGame.roomRoute === 'matchmaking') {
          showLobby()
          joinLobby(data.player)
        }
      })
    }

    matchmakingSocket.on('joinLobbyInClient', (player: Player) => {
      console.log('Joining lobby')
      console.log(player)
      showLobby()
      joinLobby(player)
    })

    matchmakingSocket.on('matchFound', () => {
      console.log('Match found')
      updateMatchedState(true)
    })

    // --- LIFECYCLE HOOKS ---
    onMounted(() => {
      console.log('In mount matchmaker')
      console.log(matchmakingSocket.id)
      checkIfInGameOrQueue()
    })

    onUnmounted(() => {
      console.log('In unmount - matchmaker matchmakingSocket.off')
      matchmakingSocket.off() // -> could be problematic between vues
      // gameRoomsSocket.off() ????
    })

    return {
      checkInGame,
      duelOptions,
      onPlayDuel,
      rooms,
      currentMode,
      currentUser,
      // GameMode,
      // lobbyVisible,
      // isMatched,
      lobby,
      leaveLobby,
      goToRoom,
    }
  },
})
</script>

<style scoped>
@import url('http://fonts.cdnfonts.com/css/pixelfaceonfire');
@import url('http://fonts.cdnfonts.com/css/messing-lettern');
@import url('http://fonts.cdnfonts.com/css/gun-metal');
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
    url('../images/vs.png');
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
