<template>
  <div class="rooms-interaction-ctn">
    <div
      class="rooms-interaction"
      @click="$emit('toggle_create_window', 'open')"
    >
      Create
    </div>
    <div class="rooms-interaction" @click="join">Join</div>
  </div>

  <div v-if="status == 'loading'">Loading...</div>

  <div class="rooms__list">
    <p v-if="!rooms.length">No rooms registered</p>
    <div v-for="room in rooms" :key="room" class="rooms__item">
      {{ room.name }}
      <div class="rooms__item-notification">
        <i class="fas fa-bell"></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import fetchRooms from '../../../composables/Chat/Rooms/fetchRooms'
import requestStatus from '../../../composables/requestStatus'

export default {
  setup() {
    let status = ref(requestStatus.loading)

    let { rooms, getRooms } = fetchRooms(status)

    onMounted(getRooms)

    return {
      rooms,
      status,
      getRooms,
    }
  },
  emits: ['toggle_create_window'],
}
</script>

<style scoped>
.rooms__banner {
  background-color: darkgray;
  border-bottom: 2px solid black;
  font-weight: bold;
}

.rooms-interaction-ctn {
  display: flex;
  background-color: darkgray;
}

.rooms-interaction {
  padding: 3px;
  flex-grow: 1;
  border-top: 2px solid black;
  border-bottom: 2px solid black;
  cursor: pointer;
}

.rooms-interaction:hover {
  background-color: white;
}

.rooms-interaction-ctn > .rooms-interaction:first-child {
  border-right: 2px solid black;
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
</style>
