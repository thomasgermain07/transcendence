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
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.game-button {
  display: block;
  margin: auto;
  text-align: center;
  position: relative;
  padding: 0.6em 1em;
  cursor: pointer;
  transition: 0.3s;

  color: var(--hovercolor);
  background: var(--color);
  font-family: 'Press Start 2P', cursive;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: inset -0.3em -0.3em 0.1em rgba(0, 0, 0, 0.16),
    0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
}

.game-button:hover {
  color: var(--color);
  background: var(--hovercolor);
  box-shadow: 0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
}
</style>
