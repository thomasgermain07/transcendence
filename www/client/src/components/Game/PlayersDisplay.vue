<template>
  <div class="players">
    <div class="player-left">
      <h3>Player left</h3>
      <div class="player-info" v-if="playerLeft">
        <p>Player id: {{ playerLeft?.id }}</p>
        <p>User name: {{ playerLeft?.user.name }}</p>
        <p>Player score: {{ playerLeft?.score }}</p>
        <p>Winner: {{ playerLeft?.winner }}</p>
        <p>Ready: {{ playerLeft?.isReady }}</p>
      </div>
      <div v-else>Waiting for Player to join</div>
    </div>
    <div class="player-right">
      <h3>Player right</h3>
      <div class="player-info" v-if="playerRight">
        <p>Player id: {{ playerRight?.id }}</p>
        <p>User name: {{ playerRight?.user.name }}</p>
        <p>Player score: {{ playerRight?.score }}</p>
        <p>Winner: {{ playerRight?.winner }}</p>
        <p>Ready: {{ playerRight?.isReady }}</p>
      </div>
      <div v-else>Waiting for Player to join</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'PlayersDisplay',
  props: ['players'],

  setup(props) {
    const playerLeft = computed(() => {
      return props.players.find((player) => player.position === 'left')
    })

    const playerRight = computed(() => {
      return props.players.find((player) => player.position === 'right')
    })

    return {
      playerLeft,
      playerRight,
    }
  },
})
</script>

<style>
.players {
  display: flex;
}

.player-left {
  flex: auto;
}

.player-right {
  flex: auto;
}
</style>
