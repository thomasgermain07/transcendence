<template>
  <button :style="customStyle" class="game-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GameButton',
  props: ['colorStyle'],
  setup(props) {
    const color = props.colorStyle

    const hovercolor = '#fff'

    const customStyle = {
      '--color': color,
      '--hovercolor': hovercolor,
    }
    return { customStyle }
  },
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Patrick+Hand');
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

/* $blue: #1645f5;
$yellow: #f0f14e;
$red: #ed3833;
$green: #6ded8a; */

.game-button {
  display: inline-block;
  text-align: center;
  position: relative;
  /* margin: 0.5em 0; */
  padding: 0.6em 1em;
  cursor: pointer;
  transition: 0.3s;

  color: var(--hovercolor);
  background: var(--color);
  font-family: 'Press Start 2P', cursive;
  /* font-size: 3em; */
  /* font-family: 'Patrick Hand', sans-serif;
  font-size: 1em;
  font-weight: 700;
  letter-spacing: 0.05em; */
  border: 2px solid black;
  border-radius: 0.6em;
  box-sizing: border-box;
  /* box-shadow: inset 0 -0.6em 0 -0.35em rgba(0, 0, 0, 0.17); */
  box-shadow: inset -0.3em -0.3em 0.1em rgba(0, 0, 0, 0.16),
    0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
  /* box-shadow: 0.5em 0.4em 1em rgb(255, 117, 117); */
}

.game-button:hover {
  color: var(--color);
  background: var(--hovercolor);
  /* box-shadow: none; */
  box-shadow: 0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
  /* border: 2px solid var(--color); */
  /* background: #fff; */
  /* color: tomato; */
}
</style>