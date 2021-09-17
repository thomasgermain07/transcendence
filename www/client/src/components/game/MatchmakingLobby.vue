<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <div class="user">
          <p>Username</p>
          <slot name="header"> This is the default title! </slot>
        </div>
        <p>GAME ROOM LOBBY</p>
      </header>

      <section class="modal-body">
        <!-- <slot name="body"> -->
          <!-- This is the default body -->
          <div class="option-item">
            <p class="options-header">MAP</p>
            <slot name="map">
              <p>default</p>
            </slot>
          </div>
          <div class="option-item">
            <p class="options-header">DIFFICULTY</p>
            <slot name="difficulty">
              <p>easy</p>
            </slot>
          </div>
          <div class="option-item">
            <p class="options-header">POWER-UPS</p>
            <slot name="power-ups">
              <p>no</p>
            </slot>
          </div>
        <!-- </slot> -->
      </section>

      <footer class="modal-footer">
        <slot name="footer">
          <div class="status">{{ status }}</div>
        </slot>

        <button
          v-show="!matchFound"
          type="button"
          class="btn"
          @click="onLeave"
        >
          Stop Waiting and Leave
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from 'vue'
import {
  DifficultyLevel,
  GameOptions,
  MapType,
} from '../../types/game/gameOptions'

export default defineComponent({
  name: 'GameLobby',
  props: ['gameMode', 'matchFound'],
  emits: [
    'close',
    'renewSearchLadder',
    'renewSearchDuel',
    'redirect-to-game-room',
  ],
  setup(props, context) {
    const defaultOptions: GameOptions = {
      map: MapType.DEFAULT,
      difficulty: DifficultyLevel.EASY,
      powerUps: false,
    }

    const defaultTimerCount = 3 // 3 seconds to redirect to game room

    let searchRange = 3 // same as in server
    const rangeIncrease = 10
    const waitTimeBefIncrease = 30 * 1000
    // const waitTimeBefIncrease = 2 * 60 * 1000

    const timerCount = ref(defaultTimerCount)
    let matchTimerId = null
    let refreshSearchTimerId = null

    const status = computed(() => {
      const foundMatch = `You will be redirected to the game in ${timerCount.value} seconds` // loading room
      const searchMatch = 'Looking for a player to join...'
      if (props.matchFound) {
        return foundMatch
      }
      return searchMatch
    })

    const startTimer = () => {
      // console.log('Starting Timer')
      matchTimerId = setInterval(() => timerCount.value--, 1000)
    }

    const startRefreshTimer = () => {
      console.log('Refresh timer on')
      refreshSearchTimerId = setInterval(() => {
        if (props.gameMode === 'ladder') {
          expandRange()
        } else if (props.gameMode === 'duel') {
          renewDuel()
        }
      }, waitTimeBefIncrease) // custom waitTime depending on game mode ?
    }

    const stopTimer = () => {
      // console.log('Stopping Timer')
      clearInterval(matchTimerId)
      matchTimerId = null
      timerCount.value = defaultTimerCount
    }

    const expandRange = () => {
      console.log('Expending range fct in component')
      searchRange += rangeIncrease
      context.emit('renewSearchLadder', searchRange)
    }

    const renewDuel = () => {
      console.log('Renew search Duel fct in component')
      context.emit('renewSearchDuel')
    }

    const onLeave = () => {
      // TODO: Are you sure window?
      console.log('Leaving lobby component')
      context.emit('close')
    }

    watch(
      () => props.matchFound,
      () => {
        console.log('In WATCHER - Matched changed')
        if (props.matchFound === true) {
          console.log('matched found')
          startTimer()
        }
      },
    )

    watch(timerCount, (value) => {
      console.log('In WATCHER - Timer changed')
      // console.log(value)
      if (value == 0) {
        console.log('TIME OUT')
        stopTimer()
        context.emit('redirect-to-game-room')
      }
    })

    onMounted(() => {
      console.log('LOBBY MOUNTED')
      startRefreshTimer()
    })

    onUnmounted(() => {
      console.log('LOBBY UNMOUNT')
      if (refreshSearchTimerId) {
        clearInterval(refreshSearchTimerId)
      }
    })

    return { props, status, defaultOptions, onLeave }
  },
})
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap");

* {
  box-sizing: border-box;
  font-family: "Inconsolata", monospace;
  font-size: 16px;
  color: var(--secondary-color);
}

.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.808);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
}

.modal {
  /* background: #ffffff; */
  background: rgb(17, 17, 31);
  box-shadow: 2px 2px 20px 1px black;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 80%;
  max-width: 800px;
  min-height: 300px;
  max-height: 70%;
  /* font-family: 'Courier New', Courier, monospace; */
  font-size: 2vh;
}

.modal-header,
.modal-footer {
  padding: 15px;
  display: flex;
  margin: 0 40px;
  padding: 20px 0;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #eeeeee;
  /* color: #4aae9b; */
  justify-content: space-between;
}

.user {
  text-transform: capitalize;
}
.user p {
  font-weight: 800;
  color: rgb(57, 57, 59);
  font-size: 12px;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  flex-direction: column;
  justify-content: flex-end;
  font-weight: 800;
  /* margin: 20px 40px; */
}
.status {
  text-align: center;
  padding-bottom: 20px;
}

.modal-body {
  position: relative;
  padding: 20px 10px;
  display: flex;
  justify-content: space-evenly;
  text-align: center;
}
.options-header {
  font-family: "Press Start 2P", cursive;
  padding-bottom: 10px;
}

.btn {
  color: var(--secondary-color);
  background: var(--primary-color);
  /* border: 1px solid #4aae9b; */
  border-radius: 2px;
  margin: auto;
  font-family: "Press Start 2P", cursive;
  font-size: 10px;
  padding: 10px 20px;
}

.btn:hover {
  color: var(--primary-color);
  background: var(--secondary-color);
}
</style>
