<template>
  <div class="watch">
    <div class="card-container" v-if="roomsList.length > 0">
      <div class="card" v-for="match in roomsList" v-bind:key="match.id">
        <header class="article-header">
          <h2 class="article-title">
            <div>{{ match.players[0].user.name }}</div>
            <div>VS</div>
            <div>{{ match.players[1].user.name }}</div>
          </h2>
        </header>
        <div class="footer">
          <button @click="onWatch(match.id)">Watch Game</button>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="default">No Game To Watch</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Room } from '@/types/game/gameRoom'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'WatchRooms',
  props: ['rooms'],

  setup(props) {
    const router = useRouter()
    const roomsList = props.rooms as Room[]

    const onWatch = (roomId: number): void => {
      router.push(`/game/room/${roomId}`)
    }

    return {
      roomsList,
      onWatch,
      router,
    }
  },
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.watch {
  padding: 0;
  margin: 0;
  font-family: 'Karmatic Arcade', sans-serif;
  color: var(--secondary-color);
}

.default {
  text-align: center;
  margin: 3rem;
  font-size: 16px;
  color: var(--tertiary-color);
}

.card-container {
  width: 90vw;
  overflow-x: scroll;
  display: flex;
  margin: auto;
  margin-bottom: 3rem;
  padding: 1rem;
}

.card {
  min-width: 300px;
  height: 200px;
  border-radius: 16px;
  background-color: var(--tertiary-color);
  box-shadow: -1rem 0 1rem rgba(0, 0, 0, 0.568);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin: 1rem;
  transition: 0.2s;
  align-items: center;
}

.card .article-header {
  margin-bottom: auto;
}

.card .article-title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
}

.card .article-title div {
  padding: 0.3rem;
}

.card:hover {
  transform: translateY(-1rem);
}

.footer {
  display: flex;
  flex-wrap: wrap;
  margin: 1rem 0 1rem;
}

.footer button {
  padding: 15px;
  font-size: 10px;
  font-family: 'Press Start 2P', cursive;
  color: var(--secondary-color);
  background-color: var(--primary-color);
  border-radius: 4%;
}

.footer button:hover {
  color: var(--primary-color);
  background-color: var(--secondary-color);
  cursor: pointer;
}
</style>
