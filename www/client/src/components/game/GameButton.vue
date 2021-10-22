<template>
  <button 
    @mouseover="hoverIn()" 
    @mouseout="hoverOut()"
    :style="customStyle" 
    class="game-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'GameButton',
  props: ['colorStyle'],
  setup(props) {
    const color: string = props.colorStyle
    const hovercolor = '#fff'

    const customStyle = reactive({
      color: hovercolor,
      backgroundColor: color,
    })

    const hoverIn = (): void => {
      customStyle.color = color
      customStyle.backgroundColor = hovercolor
    }

    const hoverOut = (): void => {
      customStyle.color = hovercolor
      customStyle.backgroundColor = color
    }

    return { customStyle, hoverIn, hoverOut }
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
  font-family: 'Press Start 2P', cursive;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: inset -0.3em -0.3em 0.1em rgba(0, 0, 0, 0.16),
    0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
}
.game-button:hover {
  box-shadow: 0px 0.6em 0.8em rgba(0, 0, 0, 0.17512156);
}
</style>
