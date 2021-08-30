<template>
  <div class="game-board">
    <div id="screen"></div>
    <canvas id="canvas" width="600" height="400"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted } from 'vue'
import { DifficultyLevel, MapType } from '../../types/game/gameOptions'
import { IBonusState, IGameState } from '../../views/GameRoom.vue'
import { Ball } from '../../types/game/ball'
import { Player } from '../../types/game/player'
import { IMapPaddleState } from '../../types/game/paddle'
import { useAuth } from '../../composables/auth'
import { useSocket } from '../../composables/socket'

export default defineComponent({
  name: 'GameBoard',
  props: ['roomName', 'isPlayer'],
  setup(props) {
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
    let bonus: IBonusState = {
      x: 0,
      y: 0,
      rayon: 0,
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
    let ctx = null
    let screen = null

    const gameRoomsSocket = useSocket('game-rooms').socket
    const roomName = props.roomName
    const isPlayer = props.isPlayer

    const { user } = useAuth()
    const currentUser = user

    const initCanvas = (): void => {
      canvas = document.getElementById('canvas')
      screen = document.getElementById('screen')
      ctx = canvas.getContext('2d')
    }

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
        canvas.width = screen.offsetWidth
        canvas.height = canvas.width / 2
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
      if (bonus.exist) {
        drawAddon()
      }
    }
    function countdown() {
      ctx.fillStyle = 'white'
      ctx.textAlign = 'center'
      ctx.font = '48px Courier New'
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
      var data = update(bonus.x, bonus.y)
      ctx.fillRect(data.x, data.y, canvas.width / 50, canvas.width / 50)
      ctx.fill()
      ctx.closePath()
    }

    // --- SOCKETS ---
    gameRoomsSocket.on('begin', (data) => {
      initCanvas()
      player_left = data.player_left
      player_right = data.player_right
      ball = data.ball
      option = data.info
      map_paddle = data.map_paddle
      bonus = data.bonus
      drawMap()
      if (option.begin) {
        countdown()
      }
    })

    const setEventListeners = () => {
      window.addEventListener('keydown', keydown)
      window.addEventListener('keyup', keyup)
      window.addEventListener('resize', resizeCanvas, false)
    }

    const unsetEventListeners = () => {
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      window.removeEventListener('resize', resizeCanvas, false)
    }

    onMounted(() => {
      console.log('In mount game-board')
      console.log(gameRoomsSocket.id)
      // console.log(`is player: ${isPlayer}`)
      if (isPlayer) {
        setEventListeners()
      }
    })
    onUnmounted(() => {
      console.log('In unmount - game-board')
      gameRoomsSocket.off()
      // console.log(`is player: ${isPlayer}`)
      if (isPlayer) {
        unsetEventListeners()
      }
    })
    // return { canvas }
  },
})
</script>

<style scoped>
#screen {
  max-width: 600px;
  max-height: 400px;
}
</style>
