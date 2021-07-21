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
      <div class="game">
        <div ref="screen"></div>
        <canvas id="canvas" width="600" height="400"></canvas>
      </div>

      <button v-if="isPlayer" @click="onLeave">Leave Game Room</button>
      <button v-if="isPlaying" @click="onGiveUp">Give Up</button>
      <button v-if="isOver" @click="onGoBack">Go Back</button>
      <button v-if="isWatching" @click="onLeaveStream">Leave Stream</button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  onMounted,
  onUnmounted,
  onBeforeMount,
} from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { io } from 'socket.io-client'

import PlayersDisplay from '../components/Game/PlayersDisplay.vue'
import useGameRoom from '../composables/Game/useGameRoom'
import { GameState, Room } from '../types/game/gameRoom'
import { Player } from '../types/game/player'
import { Ball } from '../types/game/ball'
import { MapType } from '../types/game/gameOptions'
import { IMapPaddleState } from '../types/game/paddle'
import { GameOptions, DifficultyLevel } from '../types/game/gameOptions'

export interface IGameState {
  status: string
  difficulty: string
  mode: string
  powerUps: boolean
  begin: boolean
  map: string
  count: number
}

const gameRoomsSocket = io('ws://localhost:8080/game-rooms')

export default defineComponent({
  name: 'GameRoom',
  components: { PlayersDisplay },

  setup() {
    let player_left: Player = {
      id: 0,
      user: null,
      room: null,
      position: '',
      score: 0,
      winner: false,
      isReady: false,
      paddle: {
        x: 0,
        y: 0,
        height: 0,
        move: '',
      },
    }

    let player_right: Player = {
      id: 0,
      user: null,
      room: null,
      position: '',
      score: 0,
      winner: false,
      isReady: false,
      paddle: {
        x: 0,
        y: 0,
        height: 0,
        move: '',
      },
    }

    let ball: Ball = {
      x: 0,
      y: 0,
      rayon: 0,
      xspeed: 0,
      yspeed: 0,
      exist: true,
    }

    let addon_ball: Ball = {
      x: 0,
      y: 0,
      rayon: 0,
      xspeed: 0,
      yspeed: 0,
      exist: false,
    }

    let option: IGameState = {
      status: 'waiting',
      mode: 'duel',
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
      begin: false,
      count: 3,
    }

    let map_paddle = new Array<IMapPaddleState>()

    let canvas = null
    const screen = ref<HTMLCanvasElement | null>(null)
    let ctx = null
    // let ctx = computed(() => { canvas.getContext("2d") });
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { state, room, loadRoom } = useGameRoom()

    const currentUser = store.state.user
    const roomName = `room-${route.params.id}`

    // Fetching game room
    loadRoom(route.params.id)

    const isPlayer = computed(() => {
      if (room.value.state == GameState.WAITING)
        return state.currentPlayer ? true : false
      return false
    })

    const isPlaying = computed(() => {
      console.log('-----------------------')
      console.log(room.value.state)
      if (state.currentPlayer)
        return room.value.state == GameState.PLAYING ? true : false
      return false
    })

    const isWatching = computed(() => {
      console.log(state.currentPlayer == null ? true : false)
      return state.currentPlayer == null ? true : false
    })

    const isOver = computed(() => {
      if (state.currentPlayer)
        return room.value.state == GameState.OVER ? true : false
      return false
    })

    const initCanvas = (): void => {
      canvas = document.getElementById('canvas')
      ctx = canvas.getContext('2d')
    }

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

    const onGiveUp = (): void => {
      console.log(
        `User ${currentUser.id} - player ${state.currentPlayer.id} will give up`,
      )
      gameRoomsSocket.emit(
        'giveUpRoom',
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

    const onGoBack = (): void => {
      console.log(
        `User ${currentUser.id} - player ${state.currentPlayer.id} will go Back`,
      )
      gameRoomsSocket.emit(
        'goBackRoom',
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

    const onLeaveStream = (): void => {
      gameRoomsSocket.emit(
        'leaveStream',
        {
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

        gameRoomsSocket.emit('init', {
          socketRoomName: roomName,
          room: room,
          players: room.players,
        })
      }
    }

    gameRoomsSocket.on('begin', (data) => {
      if (state.error == null && state.isLoading == false) {
        initCanvas()
        player_left = data.player_left
        player_right = data.player_right
        ball = data.ball
        option = data.info
        map_paddle = data.map_paddle
        addon_ball = data.addon_ball
        drawMap()
        if (option.begin) countdown()
      }
    })

    function drawMap() {
      ctx.fillStyle = '#000000'
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      if (option.map != MapType.MAP1) {
        drawMidleLine()
      }
      for (var paddle of map_paddle) {
        ctx.beginPath()
        ctx.fillStyle = 'white'
        var data = update(paddle.x, paddle.y)
        if (option.map == MapType.MAP1) {
          ctx.fillRect(data.x, data.y, canvas.width / 80, canvas.height / 2.5)
        } else {
          ctx.fillRect(data.x, data.y, canvas.width / 80, canvas.height / 5)
        }

        ctx.fill()
        ctx.closePath()
      }
      draw()
    }
    function update(x: number, y: number) {
      const update_data = {
        x: x * (canvas.width / 600),
        y: y * (canvas.height / 400),
      }
      return update_data
    }

    function resizeCanvas() {
      if (screen) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        redraw()
      }
    }

    function redraw() {
      drawMap()
      draw()
    }

    function keydown(event: KeyboardEvent) {
      console.log('KEY PRESS')
      if (event.key === 'ArrowUp') {
        gameRoomsSocket.emit('move', {
          move: 'up',
          user_id: currentUser.id,
          room: roomName,
        })
        console.log('KEY UP')
      } else if (event.key === 'ArrowDown') {
        gameRoomsSocket.emit('move', {
          move: 'down',
          user_id: currentUser.id,
          room: roomName,
        })
        console.log('KEY Down')
      }
      event.preventDefault()
      gameRoomsSocket.off('move')
    }

    function keyup(event: KeyboardEvent) {
      if (event.key === 'ArrowUp') {
        gameRoomsSocket.emit('move', {
          move: 'not',
          user_id: currentUser.id,
          room: roomName,
        })
        console.log('KEY UP')
      } else if (event.key === 'ArrowDown') {
        gameRoomsSocket.emit('move', {
          move: 'not',
          user_id: currentUser.id,
          room: roomName,
        })
        console.log('KEY Down')
      }
      event.preventDefault()
      gameRoomsSocket.off('move')
    }

    function draw() {
      drawPaddle()
      drawBall()
      if (addon_ball.exist) {
        drawAddon()
      }
      drawScore()
    }

    function countdown() {
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.font = '4rem Courier New'
      if (option.count > 0)
        ctx.fillText(
          option.count.toString(),
          canvas.width / 2,
          canvas.height / 2,
        )
      else if (option.count == 0)
        ctx.fillText('GO', canvas.width / 2, canvas.height / 2)
    }

    function drawMidleLine() {
      ctx.strokeStyle = 'white'
      ctx.beginPath()
      ctx.setLineDash([5, 15])
      ctx.moveTo(canvas.width / 2, canvas.height - 50)
      ctx.lineTo(canvas.width / 2, 50)
      ctx.lineWidth = 5
      ctx.stroke()

      ctx.moveTo(
        canvas.width * (canvas.width / 1088) - 600 / 80,
        canvas.height * (canvas.height / 544) - 80,
      ) // bottom left
      ctx.lineTo(
        canvas.width * (canvas.width / 1088) + 600 / 80,
        canvas.height * (canvas.height / 544) - 80,
      ) // bottom right
      ctx.lineTo(
        canvas.width * (canvas.width / 1088) + 600 / 80,
        canvas.height * (canvas.height / 544) + 80,
      ) // top right
      ctx.lineTo(
        canvas.width * (canvas.width / 1088) - 600 / 80,
        canvas.height * (canvas.height / 544) + 80,
      ) // top left
      ctx.fill()
      ctx.closePath()
    }

    function drawPaddle() {
      ctx.beginPath()
      ctx.fillStyle = 'white'
      var data = update(player_left.paddle.x, player_left.paddle.y)
      ctx.fillRect(
        data.x,
        data.y,
        canvas.width / 80,
        canvas.height / player_left.paddle.height,
      )
      data = update(player_right.paddle.x, player_right.paddle.y)
      ctx.fillRect(
        data.x,
        data.y,
        canvas.width / 80,
        canvas.height / player_right.paddle.height,
      )
      ctx.fill()
      ctx.closePath()
    }

    function drawBall() {
      ctx.beginPath()
      ctx.fillStyle = 'white'
      var data = update(ball.x, ball.y)
      ctx.arc(data.x, data.y, canvas.width / 100, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.closePath()
    }

    function drawAddon() {
      ctx.beginPath()
      ctx.fillStyle = 'red'
      var data = update(addon_ball.x, addon_ball.y)
      ctx.arc(data.x, data.y, canvas.width / 100, 0, Math.PI * 2, false)
      ctx.fill()
      ctx.closePath()
    }

    function drawScore() {
      ctx.font = '1rem Courier New'
      ctx.textAlign = 'left'
      ctx.fillText(
        'Score1 : ',
        canvas.width / 2 - canvas.width / 2.5,
        canvas.width / 10,
      )
      ctx.fillText(
        player_left.score.toString(),
        canvas.width / 2 - canvas.width / 8,
        canvas.width / 10,
      )

      ctx.fillText(
        'Score2 :',
        canvas.width / 2 + canvas.width / 10,
        canvas.width / 10,
      )
      ctx.fillText(
        player_right.score.toString(),
        canvas.width / 2 + canvas.width / 2.5,
        canvas.width / 10,
      )
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
      console.log(state.currentPlayer)
      if (room.value.state == GameState.WAITING) loadRoom(route.params.id)
    })

    onMounted(() => {
      console.log('In mount game-room')
      console.log(gameRoomsSocket.id)
      if (gameRoomsSocket.id) {
        joinRoom()
      }

      window.addEventListener('keydown', keydown)
      window.addEventListener('keyup', keyup)
      window.addEventListener('resize', resizeCanvas, false)
    })

    onUnmounted(() => {
      console.log('In unmount - gameRooms Socket.off')
      gameRoomsSocket.off()
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      window.removeEventListener('resize', resizeCanvas, false)
      gameRoomsSocket.off('move')
      gameRoomsSocket.off('init')
      gameRoomsSocket.off('begin')
      // leave room ?
    })

    return {
      route,
      store,
      state,
      room,
      currentUser,
      isPlayer,
      isPlaying,
      isOver,
      isWatching,
      onReady,
      onLeave,
      onGiveUp,
      onGoBack,
      onLeaveStream,
      canvas,
      ctx,
      screen,
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
