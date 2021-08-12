<template>
  <div class="watch">
    <div class="game-stream" v-if="props.rooms.length > 0">
      <div class="game-info" v-for="match in props.rooms" v-bind:key="match.id">
        <p>
          {{ match.players[0].user.name }} VS {{ match.players[1].user.name }}
        </p>
        <button @click="onWatch(match.id)">Watch Game</button>
      </div>
    </div>
    <div v-else>No Game To Watch</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'WatchRooms',
  props: ['rooms'],

  setup(props) {
    const router = useRouter()

    const onWatch = (roomId: number): void => {
      router.push(`/game/room/${roomId}`)
    }

    return {
      props,
      onWatch,
      router,
    }
  },
})
</script>

<style scoped>
.watch {
  text-shadow: pink 0.1em 0.1em 0.2em;
  /* font-family: 'Gunmetal', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;

  color: #000000;
}

.game-info {
  flex: auto;
  font-size: 1.4rem;
  text-align: center;
  text-shadow: pink 0.1em 0.1em 0.2em;
  /* font-family: 'Gunmetal', sans-serif; */
  font-family: 'Karmatic Arcade', sans-serif;
}
.watch button {
  display: block;
  /* background: #a03939; */
  border: none;
  margin: 20px auto 0;

  /* padding: 1em;
  color: #862f2f;*/
}

/* .ladder-info {
  flex: auto;
	font-size: 1.4rem;
	text-align: center;
} */
</style>
