<template>
  <div class="game-home">

    <h1>Ultimate Pong</h1>

    <div class="links-ctn">
      <div class="link">
        <router-link to="/game/duel" class="btn duel">Play Duel</router-link>
      </div>
      <div class="link">
        <router-link to="/game/ladder" class="btn ladder">Play Ladder</router-link>
      </div>
      <div class="link">
        <div @click="openRules" class="btn rules">How To Play</div>
      </div>
    </div>

    <div class="rules-modal" v-bind:class="{ active: isActive }">

      <span @click="closeRules" class="closing-btn">
        x
      </span>

      <h2>Duel Rules</h2>
      <p>
        A duel is a one against one pong game. In this mode you can
        choose between three maps to fight your opponent and three
        levels of difficulties. You can also choose if you want to fight
        with or without bonus options. The first player with a score of
        5 win. Be Ready to enter the arena.
      </p>
      <h2>Ladder Rules</h2>
      <p>
        A Ladder is a one against one pong game. The first player with a
        score of 5 win. There is only one map and one level for this
        mode. If you win in front of someone with a better level, his
        level became yours but if you are the one with a better level,
        you gonna lose it
      </p>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'game-home',

  setup() {

    const isActive = ref(false);

    const openRules = () => {
      console.log('in open rules')
      isActive.value = true;
    }

    const closeRules = () => {
      console.log('in open rules')
      isActive.value = false;
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
@import url("https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;400&display=swap");

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
  text-shadow: 0.1em .1em 0 rgba(0, 0, 0, 0.849);
}

/* Links */
.links-ctn {
  display: flex;
  flex-direction: column;
  height: 60vh;
  background: 
    linear-gradient(#01012b, #00000f),
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
  text-shadow: 0 0 7px #005678, 0 0 10px #005678, 0 0 21px #005678, 0 0 42px #005678, 0 0 82px #005678; 
  border: 3px double var(--primary-color);
  border-radius: 4px;
  -webkit-box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000, 5px 5px 15px 5px rgba(255,139,253,0); 
  box-shadow: 5px 5px 5px 0px #000000, inset 4px 4px 15px 0px #000000, 5px 5px 15px 5px rgba(255,139,253,0);

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
