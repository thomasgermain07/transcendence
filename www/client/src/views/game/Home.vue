<template>
  <div class="game-home">
    <h1>Ultimate Pong</h1>

    <div class="links-ctn">
      <div class="link">
        <router-link to="/game/duel" class="btn duel">Play Duel</router-link>
      </div>
      <div class="link">
        <router-link to="/game/ladder" class="btn ladder"
          >Play Ladder</router-link
        >
      </div>
      <div class="link">
        <div @click="openRules" class="btn rules">How To Play</div>
      </div>
    </div>

    <div class="rules-modal" v-bind:class="{ active: isActive }">
      <span @click="closeRules" class="closing-btn"> x </span>
      <p>
        Move the paddle and win against your opponent! Points are earned when
        one player fails to return the ball to the other player, just like in
        all table tennis games. Be Ready to enter the arena.
      </p>
      <h2>General Intructions</h2>
      <p>
        On the keyboard, use the Up and Down arrow keys to move your paddle. The
        first player to 5 points wins the game.
      </p>
      <p>
        The private matches do not count in the calculation of the game
        statistics and achievements.
      </p>
      <h2>Duel Rules</h2>
      <p>
        In this mode, choose your desired game options between three maps,
        different levels of difficulties and power-ups. Challenge a random
        player via our matchmaking interface or invite a friend to play a
        private game via the chat.
      </p>
      <h2>Ladder Rules</h2>
      <p>
        In this mode, play against other players to move up on the ladder! If
        you win, points will be added to your ladder level but if you lose,
        points will be deducted.
      </p>
      <h2>Play against your friends!</h2>
      <p>
        Via the chat interface, click right on the name of any of your friends
        and invite them to play with the "Send Duel" option. Your private game
        will start upon acceptation of your invitation.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'game-home',

  setup() {
    const isActive = ref(false)

    const openRules = () => {
      isActive.value = true
    }

    const closeRules = () => {
      isActive.value = false
    }

    return {
      openRules,
      closeRules,
      isActive,
    }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
  font-family: 'Press Start 2P', cursive;
  box-sizing: border-box;
}

/* Title  */
h1 {
  font-size: 5vw;
  text-transform: uppercase;
  color: var(--primary-color);
  margin: 30px auto;
  text-align: center;
  text-shadow: 0.1em 0.1em 0 rgba(0, 0, 0, 0.849);
}

/* Links */
.links-ctn {
  display: flex;
  flex-direction: column;
  height: 60vh;
  background: linear-gradient(#01012b, #00000f),
    url(../../assets/images/pong-table.jpg) no-repeat center center;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  background-blend-mode: saturation;
}

.link {
  text-transform: uppercase;
  margin: auto;
}

.btn {
  padding: 1em;
  display: inline-block;
  text-decoration: none;
  background-color: hsla(240, 100%, 4%, 0.718);
  letter-spacing: 3px;
  font-weight: 700;
  color: var(--secondary-color);
  text-shadow: 0 0 7px #005678, 0 0 10px #005678, 0 0 21px #005678,
    0 0 42px #005678, 0 0 82px #005678;
  border: 3px double var(--primary-color);
  border-radius: 4px;
  -webkit-box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
    5px 5px 15px 5px rgba(255, 139, 253, 0);
  box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000,
    5px 5px 15px 5px rgba(255, 139, 253, 0);
}

.btn:hover {
  border-color: var(--secondary-color);
  transform: translate(0.25em, 5%);
  box-shadow: 0 0 0 2px pink, 0 0 pink;
  text-shadow: none;
}

.btn.rules {
  cursor: pointer;
}

/* Rules Modal */
.rules-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  height: 400px;
  max-height: 100%;
  padding: 20px 50px 20px 20px;
  transform: translate(-50%, -50%);
  overflow: scroll;
  background-color: rgb(231, 234, 238);
  color: black;
  line-height: 130%;
  box-shadow: 0 0 60px 10px rgba(0, 0, 0, 0.9);
  border-radius: 2px;
  display: none;
  z-index: 100;
}
.rules-modal h2 {
  text-align: left;
  margin-top: 30px;
}
.rules-modal p {
  text-align: left;
  margin: 10px 0;
  font-size: 10px;
}
.rules-modal.active {
  display: block;
}
.closing-btn {
  cursor: pointer;
  font-size: 1.3rem;
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 20px;
}
</style>
