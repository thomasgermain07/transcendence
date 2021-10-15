<template>
  <div class="ladder-game">
    <div v-if="loading">LOADING...</div>
    <div v-else>
      <GameLobby
        v-if="lobby.visible"
        :gameMode="'ladder'"
        :matchFound="lobby.matched"
        @close="leaveLobby"
        @renewSearchLadder="expandRange"
        @redirect-to-game-room="goToRoom"
      >
        <template v-slot:header> Hi {{ currentUser.name }} </template>
      </GameLobby>
      <section class="ladder-play">
        <div class="ladder-start-game">
          <h1>Ladder Mode</h1>
          <button class="start-button" @click="onPlayLadder">Start Game</button>
          <div class="in-game" v-if="checkInGame.inGame">
            <p>YOU ARE ALREADY IN A GAME.</p>
            <p>
              CLICK
              <router-link :to="checkInGame.roomRoute">HERE</router-link> TO GO
              TO THE GAME ROOM.
            </p>
          </div>
        </div>
        <div class="ladder-level">
          <p>Current Ladder Level</p>
          <div class="box">{{ currentUser.ladderLevel }}</div>
        </div>
      </section>

      <section class="game-stream-list">
        <div class="title">LIVE STREAMS ></div>
        <WatchRooms :rooms="rooms" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { GameMode, Room } from '../../types/game/gameRoom'
import { Player } from '../../types/game/player'
import GameLobby from '../../components/game/MatchmakingLobby.vue'
import WatchRooms from '../../components/game/WatchRooms.vue'
import useAllGameRoom from '../../composables/Game/useAllGameRoom'
import useMatchmaker from '../../composables/Game/useMatchmaker'
import { useUsers } from '../../composables/users'
import { useSocket } from '../../composables/socket'
import { useAuth } from '../../composables/auth'

export default defineComponent({
  name: 'game-ladder',
  components: { WatchRooms, GameLobby },

  setup() {
    const loading = ref(true)

    const { users, get } = useUsers()
    get().then(() => {
      loading.value = false
    })

    const { rooms, loadGameRooms } = useAllGameRoom('ladder')

    const matchmakingSocket = useSocket('matchmaker').socket
    const gameRoomsSocket = useSocket('game-rooms').socket

    const {
      lobby,
      roomName,
      checkInGame,
      checkIfInGameOrQueue,
      updateMatchedState,
      joinLobby,
      leaveLobby,
      goToRoom,
      expandRange,
      playGame,
    } = useMatchmaker()

    loadGameRooms()

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      loadGameRooms()
      rooms.value = { ...updatedRoom }
    }

    const onPlayLadder = (): void => {
      playGame(GameMode.LADDER, null)
    }

    // --- SOCKETS LISTENERS ---
    matchmakingSocket.on('joinLobbyInClient', (player: Player) => {
      joinLobby(player)
    })

    matchmakingSocket.on('matchFound', () => {
      updateMatchedState(true)
    })

    gameRoomsSocket.on('updateWatchRoomInClient', ({ rooms }) => {
      updateWatchRooms(rooms)
    })

    // --- NAVIGATION GUARDS ---
    onBeforeRouteLeave((to, from) => {
      const { is_authenticated } = useAuth()
      if (!is_authenticated.value && lobby.visible) {
        leaveLobby()
        return
      }

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

    // --- LIFEHCYCLE HOOKS ---
    onMounted(() => {
      checkIfInGameOrQueue()
    })

    onUnmounted(() => {
      matchmakingSocket.emit('leaveLobbySocket', {
        room: roomName.value,
      })
      matchmakingSocket.off()
      // gameRoomsSocket.off() ????
    })

    return {
      checkInGame,
      onPlayLadder,
      rooms,
      currentUser: users,
      lobby,
      leaveLobby,
      goToRoom,
      expandRange,
      loading,
    }
  },
})
</script>

<style scoped>
@import url('http://fonts.cdnfonts.com/css/karmatic-arcade');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.ladder-game {
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  letter-spacing: 1px;
  text-align: justify;
  color: var(--secondary-color);
}

h1 {
  font-size: 64px;
  letter-spacing: -1px;
}

.ladder-play {
  background: linear-gradient(
      to bottom,
      rgba(25, 24, 26, 0.562),
      rgba(17, 17, 19, 0.5)
    ),
    url(../../assets/images/levelUp.png) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  margin-bottom: 20px;
  min-height: 300px;
}

@media only screen and (max-width: 768px) {
  .ladder-play {
    flex-direction: column;
    text-align: center;
  }
}

.ladder-start-game {
  padding: 25px;
  flex: 1;
}

.start-button {
  padding: 15px;
  margin: 30px 0;
  font-size: 16px;
  font-family: 'Press Start 2P', cursive;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  border-radius: 4%;
}

.start-button:hover {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  cursor: pointer;
}

.ladder-start-game p {
  color: var(--primary-color);
  line-height: 180%;
}

.in-game a {
  color: var(--secondary-color);
}

.ladder-level {
  flex: 2;
  margin: auto;
  text-align: center;
  font-size: 24px;
}

.ladder-level .box {
  width: 10%;
  margin: 50px auto;
  padding: 20px;
  border: solid 8px var(--secondary-color);
  border-radius: 100px;
}

.game-stream-list .title {
  font-size: 16px;
  margin: 50px 0 0 20px;
  color: var(--tertiary-color);
}
</style>
