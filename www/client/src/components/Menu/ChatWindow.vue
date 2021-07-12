<template>
  <div class="chat-window">
    <div class="rooms">
      <header class="rooms__banner">Rooms</header>
      <div v-if="loading">Loading...</div>
      <div class="rooms__list">
        <div
          v-for="room in rooms"
          :key="room"
          class="rooms__item"
          @click="$emit('set_current_room', room.name)"
        >
          {{ room.name }}
          <div class="rooms__item-notification">
            <i class="fas fa-bell"></i>
          </div>
        </div>
      </div>
    </div>
    <div class="chat"></div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

export default {
  setup() {
    let rooms = ref([])
    let loading = ref(true)

    const getRooms = async () => {
      let { data } = await axios.get(
        'https://60d5fd1b943aa60017768d55.mockapi.io/api/rooms',
      )
      rooms.value = data
      loading.value = false
    }

    onMounted(getRooms)

    return {
      rooms,
      loading,
      getRooms,
    }
  },
  emits: ['set_current_room'],
}
</script>

<style scoped>
.chat-window {
  display: flex;
  height: 400px;
}

.rooms {
  flex-basis: 180px;
  border-right: 2px solid lightgray;
  overflow-y: auto;
  overflow-x: none;
}

.rooms__banner {
  background-color: darkgray;
  border-bottom: 2px solid black;
}

.rooms__list {
  display: flex;
  flex-direction: column;
}

.rooms__item {
  display: flex;
  justify-content: space-between;
  padding: 4px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.chat {
  flex-grow: 1;
}
</style>
