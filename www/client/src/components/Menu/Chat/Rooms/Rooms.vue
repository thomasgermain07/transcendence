<template>
  <div class="rooms-interaction-ctn">
    <div class="rooms-interaction" @click="$emit('open', 'create')">Create</div>
    <div class="rooms-interaction" @click="$emit('open', 'join')">Join</div>
  </div>

  <div v-if="status == 'loading'">Loading...</div>

  <div v-if="rooms" class="rooms__list">
    <p v-if="!rooms.length">No rooms registered</p>
    <div
      v-for="room in rooms"
      :key="room"
      class="rooms__item"
      @click="$emit('open', 'room', { id: room.id, name: room.name })"
    >
      {{ room.name }}
      <span v-if="room.notification" class="notification"></span>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import getFetchRooms from '@/composables/Chat/Rooms/fetchRooms'
import requestStatus from '@/composables/requestStatus'

export default {
  props: {
    CurrentRoomId: Number,
  },
  setup(props) {
    let status = ref(requestStatus.loading)

    let { rooms, fetchRooms } = getFetchRooms(status)

    onMounted(() => fetchRooms(true))

    const notify = (id: Number) => {
      rooms.value!.find((room) => room.id == id)!.notification = true
    }

    const notificationRead = (id: Number) => {
      rooms.value!.find((room) => room.id == id)!.notification = false
    }

    return {
      rooms,
      status,
      fetchRooms,
      notify,
      notificationRead,
    }
  },
  emits: ['open'],
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

.notification {
  color: red;
  background-color: red;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
}

.rooms-interaction {
  padding: 3px;
  flex-grow: 1;
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
