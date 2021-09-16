<template>
  <div class="game">
    <!-- <h1>Game</h1> -->

    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'game',

  setup() {},
})
</script>

<style scoped>
/* .game {
  background: rgb(184, 62, 184);
} */
</style>
