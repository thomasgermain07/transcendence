<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <div class="user">
          <p>Username</p>
          <slot name="header"> This is the default title! </slot>
        </div>
        <p>{{ props.gameMode }}</p>
        <p>GAME ROOM LOBBY</p>
      </header>

      <section class="modal-body">
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
      </section>

      <footer class="modal-footer">
        <slot name="footer">
          <div class="status">{{ status }}</div>
        </slot>

        <button v-show="!matchFound" type="button" class="btn" @click="onLeave">
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

    const defaultTimerCount: number = 3

    let searchRange: number = 3
    const rangeIncrease: number = 10
    const waitTimeBefIncrease: number = 30 * 1000

    const timerCount = ref(defaultTimerCount)
    let matchTimerId: number | undefined
    let refreshSearchTimerId: number | undefined

    const status = computed(() => {
      const foundMatch = `You will be redirected to the game in ${timerCount.value} seconds`
      const searchMatch = 'Looking for a player to join...'
      if (props.matchFound) {
        return foundMatch
      }
      return searchMatch
    })

    const startTimer = (): void => {
      matchTimerId = setInterval(() => timerCount.value--, 1000)
    }

    const startRefreshTimer = (): void => {
      refreshSearchTimerId = setInterval(() => {
        if (props.gameMode === 'ladder') {
          expandRange()
        } else if (props.gameMode === 'duel') {
          renewDuel()
        }
      }, waitTimeBefIncrease)
    }

    const stopTimer = (): void => {
      clearInterval(matchTimerId)
      matchTimerId = undefined
      timerCount.value = defaultTimerCount
    }

    const expandRange = (): void => {
      searchRange += rangeIncrease
      context.emit('renewSearchLadder', searchRange)
    }

    const renewDuel = (): void => {
      context.emit('renewSearchDuel')
    }

    const onLeave = (): void => {
      context.emit('close')
    }

    watch(
      () => props.matchFound,
      () => {
        if (props.matchFound === true) {
          startTimer()
        }
      },
    )

    watch(timerCount, (value: number) => {
      if (value == 0) {
        stopTimer()
        context.emit('redirect-to-game-room')
      }
    })

    onMounted(() => {
      startRefreshTimer()
    })

    onUnmounted(() => {
      if (refreshSearchTimerId) {
        clearInterval(refreshSearchTimerId)
      }
    })

    return { props, status, defaultOptions, onLeave }
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: 'Inconsolata', monospace;
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
  font-family: 'Press Start 2P', cursive;
  padding-bottom: 10px;
}

.btn {
  color: var(--secondary-color);
  background: var(--primary-color);
  border-radius: 2px;
  margin: auto;
  font-family: 'Press Start 2P', cursive;
  font-size: 10px;
  padding: 10px 20px;
}

.btn:hover {
  color: var(--primary-color);
  background: var(--secondary-color);
}
</style>
