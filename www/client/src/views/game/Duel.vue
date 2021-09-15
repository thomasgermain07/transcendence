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
      <template v-slot:header> {{ currentUser.name }} </template>
      <template v-slot:map>
          <p>{{ lobby.player.room.option.map }}</p>
      </template>
      <template v-slot:difficulty>
          <p>{{ lobby.player.room.option.difficulty }}</p>
      </template>
      <template v-slot:power-ups>
          <p v-if="lobby.player.room.option.powerUps">yes</p>
          <p v-else>no</p>
      </template>
    </GameLobby>
    <section class="duel-play">
      <div class="duel-start-game">
        <h1>Duel Mode</h1>
        <button class="start-button" @click="onPlayDuel">Start Game</button>
        <div class="in-game" v-if="checkInGame.inGame">
          <p>YOU ARE ALREADY IN A GAME.</p>
          <p>CLICK <router-link :to="checkInGame.roomRoute">HERE</router-link> TO GO TO THE GAME ROOM.</p>
        </div>
      </div>
      <div class="duel-game-options">
        <div class="name">Select options</div>
        <div class="options">
          <div class="map">
            <p>MAP</p>
              <div class="tabs">
                <div class="tab">
                  <input type="radio" value="default" id="tab-1" name="tab-group-1" checked v-model="duelOptions.map" />
                  <label for="tab-1">Default</label>
                  <div class="content">
                      <img src="../../assets/images/mapDefault.png" />
                  </div>
                </div>
                <div class="tab">
                  <input type="radio" value="map1" id="tab-2" name="tab-group-1" v-model="duelOptions.map" />
                  <label for="tab-2">Map 1</label>
                  <div class="content">
                      <img src="../../assets/images/map1.png" />
                  </div>
                </div>
                <div class="tab">
                  <input type="radio" value="map2" id="tab-3" name="tab-group-1" v-model="duelOptions.map" />
                  <label for="tab-3">Map 2</label>
                  <div class="content">
                      <img src="../../assets/images/map2.png" />
                </div>
              </div>
            </div>
          </div>
          <div class="difficulty">
            <p>DIFFICULTY</p>
            <ul>
              <li>
                <input id="r1" type="radio" value="easy" v-model="duelOptions.difficulty" />
                <label for="r1">Easy</label>
              </li>
              <li>
                <input id="r2" type="radio" value="medium" v-model="duelOptions.difficulty"/>
                <label for="r2">Medium</label>
              </li>
              <li>
                <input id="r3" type="radio" value="hard" v-model="duelOptions.difficulty"/>
                <label for="r3">Hard</label>
              </li>
            </ul>
          </div>
          <div class="power-ups">
            <p>POWER UPS</p>
            <div class="switch">
              <input id="switch-1" type="checkbox" class="switch-input" v-model="duelOptions.powerUps"/>
              <label for="switch-1" class="switch-label">Switch</label>
            </div>
          </div>
        </div>        
      </div>
    </section>

    <section class="game-stream-list">
      <div class="title">LIVE STREAMS ></div>
      <WatchRooms :rooms="rooms" />
    </section>


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
import { useAuth } from '../../composables/auth'
import { useSocket } from '../../composables/socket'

export default defineComponent({
  name: 'game-duel',
  components: { WatchRooms, GameLobby },
  setup() {
    const { user } = useAuth()
    const currentUser = user

    const { rooms, loadGameRooms } = useAllGameRoom('duel')

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
      // console.log(duelOptions)
      playGame(GameMode.DUEL, duelOptions)
    }

    const updateWatchRooms = (updatedRoom: Room[]): void => {
      loadGameRooms()
      rooms.value = { ...updatedRoom }
    }

    // --- SOCKETS LISTENERS ---
    matchmakingSocket.on('connect', () => {
      console.log('matchmakingSocket connected')
      // console.log(matchmakingSocket.id)
      console.log(matchmakingSocket.rooms)
    })
    matchmakingSocket.io.on('reconnect', () => {
      console.log('matchmakingSocket reconnected')
      // console.log(matchmakingSocket.id)
      console.log(matchmakingSocket.rooms)
    })
    matchmakingSocket.on('disconnect', () => {
      console.log(`matchmakingSocket disconnected`)
    })
    matchmakingSocket.on('exception', (err) => {
      console.log('IN EXCEPTION DUEL')
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

      // if soft logout
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
@import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");

.duel-game {
  font-family: "Press Start 2P", cursive;
  font-size: 10px;
  letter-spacing: 1px;
  text-align: justify;
  color: var(--secondary-color);
}

h1 {
  font-size: 64px;
  letter-spacing: -1px;
}


.duel-play {
  /* background-color: rgba(1, 1, 2, 0.37); */
  background: linear-gradient(
      to bottom,
      rgba(25, 24, 26, 0.562),
      rgba(17, 17, 19, 0.5)
    ),
    url(../../assets/images/vs.png) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  display: flex;
  margin-bottom: 20px;
}

@media only screen and (max-width: 768px) {
  .duel-play {
    flex-direction: column;
    text-align: center;
  }

  .options {
    flex-direction: column;
    align-items: center;
  }

}

.duel-start-game {
  padding: 25px;
  flex: 1;
}

.start-button {
  padding: 15px;
  margin: 30px 0;
  font-size: 16px;
  font-family: "Press Start 2P", cursive;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  border-radius: 4%;
}

.start-button:hover {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  cursor: pointer;
}

.duel-start-game p {
  color: var(--primary-color);
  line-height: 180%;
}

.in-game a {
  color: var(--secondary-color);
}

.duel-game-options {
  padding: 25px;
  flex: 2;
}

.duel-game-options .name {
  text-align: center;
  padding-bottom: 20px;
  font-size: 16px;
}

.options {
  display: flex;
  justify-content: space-evenly;
}

.options p {
  text-align: center;
  padding: 20px 0;
  letter-spacing: 1.5px;
  font-family: 'Karmatic Arcade', sans-serif;
  font-size: 12px;
}

/* Map selection tabs  */
.tabs {
  position: relative;
  min-height: 200px;
  clear: both;
  margin: 25px 0;
}
.tab {
  float: left;
}

.tab [type="radio"] ~ label {
  position: relative;
  font-size: 10px;
}

.tab [type="radio"] {
  opacity: 0;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  padding: 20px;
  border-radius: 3px;
  overflow: hidden;
  text-align: center;
}
.content > * {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 0.3s ease;
}

.content img {
  max-width: 100%;
  height: auto;
  display: block;
}

.tab [type="radio"]:checked ~ label {
  border-bottom: 1px solid white;
  /* z-index: 2; */
}
/* .tab [type="radio"]:checked ~ label ~ .content {
  z-index: 1;
} */
.tab [type="radio"]:checked ~ label ~ .content > * {
  opacity: 1;
  transform: translateX(0);
}


/* Difficulty select list  */
ul {
  margin: 12px;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 320px;
}

li {
  margin: 16px 0;
  position: relative;
}

@supports (-webkit-appearance: none) or (-moz-appearance: none) {
  input[type="radio"] {
    --active: #ff2a6d;
    --active-inner: #fff;
    --focus: 2px rgba(255, 42, 109, 0.3);
    --border: #bbc1e1;
    --border-hover: rgb(255, 42, 109);
    --background: #fff;
    --disabled: #f6f8ff;
    --disabled-inner: #e1e6f9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background 0.3s, border-color 0.3s, box-shadow 0.2s;
  }
  input[type="radio"]:after {
    content: "";
    display: block;
    left: 0;
    top: 0;
    position: absolute;
    transition: transform var(--d-t, 0.3s) var(--d-t-e, ease),
      opacity var(--d-o, 0.2s);
  }
  input[type="radio"]:checked {
    --b: var(--active);
    --bc: var(--active);
    --d-o: 0.3s;
    --d-t: 0.6s;
    --d-t-e: cubic-bezier(0.2, 0.85, 0.32, 1.2);
  }
  input[type="radio"]:disabled {
    --b: var(--disabled);
    cursor: not-allowed;
    opacity: 0.9;
  }
  input[type="radio"]:disabled:checked {
    --b: var(--disabled-inner);
    --bc: var(--border);
  }
  input[type="radio"]:disabled + label {
    cursor: not-allowed;
  }
  input[type="radio"]:hover:not(:checked):not(:disabled) {
    --bc: var(--border-hover);
  }
  input[type="radio"]:focus {
    box-shadow: 0 0 0 var(--focus);
  }
  input[type="radio"]:not(.switch) {
    width: 21px;
  }
  input[type="radio"]:not(.switch):after {
    opacity: var(--o, 0);
  }
  input[type="radio"]:not(.switch):checked {
    --o: 1;
  }
  input[type="radio"] + label {
    font-size: 12px;
    line-height: 21px;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    margin-left: 4px;
  }
  input[type="radio"] {
    border-radius: 50%;
  }
  input[type="radio"]:after {
    width: 19px;
    height: 19px;
    border-radius: 50%;
    background: var(--active-inner);
    opacity: 0;
    transform: scale(var(--s, 0.7));
  }
  input[type="radio"]:checked {
    --s: 0.5;
  }
}

/* Power Ups Switch button */
.switch {
  position: relative;
  display: inline-block;
  margin: 20px;
}
.switch-input {
  display: none;
}
.switch-label {
  display: block;
  width: 48px;
  height: 24px;
  text-indent: -150%;
  clip: rect(0 0 0 0);
  color: transparent;
  user-select: none;
}
.switch-label::before,
.switch-label::after {
  content: "";
  display: block;
  position: absolute;
  cursor: pointer;
}
.switch-label::before {
  width: 100%;
  height: 100%;
  background-color: #dedede;
  border-radius: 9999em;
  -webkit-transition: background-color 0.25s ease;
  transition: background-color 0.25s ease;
}
.switch-label::after {
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.45);
  -webkit-transition: left 0.25s ease;
  transition: left 0.25s ease;
}
.switch-input:checked + .switch-label::before {
  background-color: var(--primary-color);
}
.switch-input:checked + .switch-label::after {
  left: 24px;
}

.game-stream-list .title {
  font-size: 16px;
  margin: 50px 0 0 20px;
  color: var(--tertiary-color);
}

</style>
