<template>
  <div class="players-box">
    <div class="player-details" v-if="playerLeft">
      <section class="player-logo">
        <img src="https://image.flaticon.com/icons/png/512/4865/4865927.png" alt="logo1" />
      </section>
      <section class="player-info">
        <span class="winner">{{ playerLeft?.winner ? '👑' : '' }}</span>
        <div class="player-name">{{ playerLeft?.user.name.slice(0, 5) }}</div>
        <div class="player-rank">RANK {{ playerLeft?.user.ladderLevel }}</div>
      </section>
    </div>
    <div v-else>Waiting for Player to join</div>
    <div class="score">
      <div class="score-box">
        <div class="score-left">
          {{ playerLeft?.score }}
        </div>
        <div class="score-sep">-</div>
        <div class="score-right">
          {{ playerRight?.score }}
        </div>
      </div>
      <div class="status">
        <span
          v-bind:class="{
            playing: props.roomState === 'playing',
            over: props.roomState === 'over',
          }"
        >
          {{ status }}
        </span>
      </div>
    </div>
    <div class="player-details inverse" v-if="playerRight">
      <section class="player-logo">
        <img src="https://image.flaticon.com/icons/png/512/4865/4865942.png" alt="logo2" />
      </section>
      <section class="player-info">
        <span class="winner">{{ playerRight?.winner ? '👑' : '' }}</span>
        <div class="player-name">{{ playerRight?.user.name.slice(0, 5) }}</div>
        <div class="player-rank">RANK {{ playerRight?.user.ladderLevel }}</div>
      </section>
    </div>
    <div v-else>Waiting for Player to join</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { GameState } from '../../types/game/gameRoom'
import { Player } from '../../types/game/player'

export default defineComponent({
  name: 'PlayersDisplay',
  props: ['players', 'roomState'],

  setup(props) {
    const playerLeft: Player = computed(() => {
      return props.players.find((player) => player.position === 'left')
    })

    const playerRight: Player = computed(() => {
      return props.players.find((player) => player.position === 'right')
    })

    const status: string = computed(() => {
      if (props.roomState === GameState.PLAYING) {
        return 'playing'
      } else if (props.roomState === GameState.OVER) {
        return 'FINAL'
      } else {
        return ''
      }
    })

    return {
      playerLeft,
      playerRight,
      props,
      status,
    }
  },
})
</script>

<style scoped>
@import url('http://fonts.cdnfonts.com/css/scoreboard');
@import url('http://fonts.cdnfonts.com/css/alpha-echo');
@import url('http://fonts.cdnfonts.com/css/karmatic-arcade');
/* @import url('http://fonts.cdnfonts.com/css/vanthian-ragnarok'); */

.players-box {
  /* background-color: #e1e8eb; */
  display: inline-flex;
  max-width: 50rem;
  min-height: 10rem;
  margin: 2rem auto;
  padding: 0 1rem;
  overflow: hidden;
  box-shadow: 0 0 20px 8px #d0d0d0;
  border-radius: 20px;
  border: 10px solid black;
  color: #0a0a0a;
  /* font-family: 'Exo', sans-serif;
  font-weight: 700; */
  font-family: 'Karmatic Arcade', sans-serif;
}

.score {
  margin: auto 2vw;
  display: inline-flex;
  flex-direction: column;
  font-size: 3rem;
  /* color: #363636; */
  /* font-family: 'SCOREBOARD', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;
  /* font-family: 'Vanthian Ragnarok', sans-serif; */
}

.score-box {
  display: inline-flex;
}

.score div {
  padding: 0.5rem;
}

.status span {
  display: none;
  font-family: 'Exo', sans-serif;
  font-size: 1rem;
  font-weight: 700;
}

.status .over {
  display: block;
  color: #ed3833;
}
.status .playing {
  display: block;
  color: #6ded8a;
  font-style: italic;
}

@media (max-width: 600px) {
  .player-details {
    flex-direction: column;
  }
  .player-logo {
    order: 1;
  }
}

.player-details {
  /* border: 2px solid black; */
  display: inline-flex;
  align-items: center;
  text-transform: uppercase;
}

.player-details section {
  width: 100%;
}

.player-info {
  display: inline-flex;
  flex-direction: column;
  padding: 1rem;
  width: 100%;
}

.player-name {
  font-size: 3vw;
}

.player-rank {
  padding: 0.2rem;
  color: #8b8b8b;
  font-size: 0.5625em;
  line-height: 1em;
}

.player-logo img {
  max-width: 8rem;
  max-height: 8rem;
  width: 100%;
  margin: auto;
}

.inverse .player-logo {
  order: 1;
}

.winner {
  font-size: 4em;
  /* color: #ed3833; */
  /* padding: 1em; */
}
</style>