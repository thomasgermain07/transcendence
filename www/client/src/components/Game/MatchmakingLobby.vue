<template>
  <div class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <slot name="header">
          This is the default title!
        </slot>
        <!-- <button
          type="button"
          class="btn-close"
          @click="close"
        >
          x
        </button> -->
      </header>

      <section class="modal-body">
        <slot name="body">
          This is the default body!
          <h3>Room Options: </h3>
          <p>Map : {{ room.option.map }}</p>
          <p>Level: {{ room.option.difficulty }}</p>
          <p>Addons: {{ room.option.powerUps }}</p>
        </slot>
       </section>

      <footer class="modal-footer">
        <slot name="footer">
            <p>Has been matched? {{ matched }} </p>
          {{ status }} (default)
        </slot>
        <!-- <button
          type="button"
          class="btn-green"
          @click="close"
        >
          Close Modal
        </button> -->
        <button
          v-show="!matched"
          type="button"
          class="btn-green"
          @click="leaveLobby"
        >
          Stop Waiting and Leave
        </button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from 'vue';

export default defineComponent({
    name: 'GameLobby',
    props: ["room", "isMatched"],
    emits: ["close", "leaveLobby"],
    setup(props, context) {

        const room = props.room
        
        const matched = computed(() => {
            return props.isMatched
        })

        const timerCount = ref(4)

        const status = computed(() => {
            const foundMatch = `You will be redirected to the game in ${timerCount.value} seconds` // loading room
            const searchMatch = 'Looking for a player to join...'

            if (matched.value) {
                return foundMatch
            }
            return searchMatch
        })

        const close = () => {
            context.emit('close')
        }

        const leaveLobby = () => {
            console.log('leave lobby')
            context.emit('leaveLobby', true)
        }
        
        const startTimer = () => {
            console.log('Starting Timer')
            timerCount.value--
        }
        watch(() => props.isMatched, () => {
			console.log('In WATCHER - Matched changed')
            startTimer()
            // matched = props.isMatched
		})

        watch(timerCount, (value) => {
			// console.log('In WATCHER - Timer changed')
			// console.log(value)
            if (value > 0) {
                setTimeout(() => {
                    timerCount.value = value - 1;
                }, 1000);
            } else if (value == 0) {
                console.log('TIME OUT')
                close()
            }
        })

        onMounted(() => {
            // console.log('LOBBY MOUNTED')
            // console.log(matched.value)
            if (matched.value === true) {
                startTimer()
            }
        })

        return { room, matched, status, close, leaveLobby }
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
  }

  .modal {
    background: #FFFFFF;
    box-shadow: 2px 2px 20px 1px;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    width: 90%;
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