<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          This is the default title!
        </slot>
      </header>

      <section class="modal-body">
        <slot name="body">
          This is the default body
          <h3>Room Options: </h3>
          <p>Map : {{ defaultOptions.map }}</p>
          <p>Level: {{ defaultOptions.difficulty }}</p>
          <p>Addons: {{ defaultOptions.powerUps }}</p>
        </slot>
       </section>

      <footer class="modal-footer">
        <slot name="footer">
            <p>Has been matched? {{ props.matchFound }} </p>
          {{ status }}
        </slot>

        <button
          v-show="!matchFound"
          type="button"
          class="btn-green"
          @click="onLeave"
        >
          Stop Waiting and Leave
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { DifficultyLevel, GameOptions, MapType } from '../../types/game/gameOptions';

export default defineComponent({
    name: 'GameLobby',
    props: ["gameMode", "matchFound"],
    emits: ["close", "renewSearch", "redirect-to-game-room"],
    setup(props, context) {

      const defaultOptions: GameOptions = {
        map: MapType.DEFAULT,
        difficulty: DifficultyLevel.EASY,
        powerUps: false,
      }

      const defaultTimerCount = 3

      let searchRange = 3 // same as in server
      const rangeIncrease = 10
      const waitTimeBefIncrease = 30 * 1000
      // const waitTimeBefIncrease = 2 * 60 * 1000

      const timerCount = ref(defaultTimerCount)
      let matchTimerId = null
      let ladderTimerId = null

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

      const startLadderTimer = () => {
        // console.log('Starting Timer')
        console.log('Ladder timer on')
        ladderTimerId = setInterval(() => {
          expandRange()          
        }, waitTimeBefIncrease)
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
        console.log('Search Range: ' + searchRange)
        // context.emit('renewSearch', searchRange)
        context.emit('renewSearch', searchRange)
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
          // router.push(`/game/room/${room.value.id}`)
        }
      })

      onMounted(() => {
        console.log('LOBBY MOUNTED')
        // console.log(matched.value)
        console.log(props.gameMode)
        if (props.gameMode === 'ladder') {
          console.log('Lobby: in ladder mode')
          startLadderTimer()
        }
      })

      onUnmounted(() => {
        console.log('LOBBY UNMOUNT')
        if (ladderTimerId) {
          clearInterval(ladderTimerId)
        }
      })

      return { props, status, defaultOptions, onLeave }
    },
})
</script>


<style>
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
    /* z position  */
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    width: 80%;
    max-height: 70%;
    /* font-family: 'Courier New', Courier, monospace; */
    font-size: 2vh;
  }

  .modal-header,
  .modal-footer {
    padding: 15px;
    display: flex;
  }

  .modal-header {
    position: relative;
    border-bottom: 1px solid #eeeeee;
    color: #4AAE9B;
    justify-content: space-between;
  }

  .modal-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .modal-body {
    position: relative;
    padding: 20px 10px;
    /* font-family: 'Courier New', Courier, monospace; */
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }
</style>