<template>
  <div class="chat-window">
    <div class="rooms-ctn">
      <header class="room-label">Rooms</header>
      <Rooms ref="rooms" @toggle_create_window="toggle_create_window" />
    </div>
    <div class="chat-ctn">
      <CreateRoom
        @toggle_create_window="toggle_create_window"
        v-if="showCreateRoom"
        @refresh_rooms="refresh_rooms"
      ></CreateRoom>
    </div>
  </div>
</template>

<script lang="ts">
import Rooms from './Chat/Rooms.vue'
import CreateRoom from './Chat/CreateRoom.vue'
import { ref } from 'vue'

export default {
  components: {
    Rooms,
    CreateRoom,
  },
  data() {
    return {
      refresh: false,
    }
  },
  setup() {
    let showCreateRoom = ref(false)
    const rooms = ref()

    const toggle_create_window = (state: String) => {
      if (state == 'open') {
        showCreateRoom.value = true
      } else if (state == 'close') {
        showCreateRoom.value = false
      }
    }
    const refresh_rooms = () => {
      rooms.value.getRooms()
    }

    return {
      rooms,
      showCreateRoom,
      toggle_create_window,
      refresh_rooms,
    }
  },
}
</script>

<style scoped>
.chat-window {
  flex-grow: 1;
  display: flex;
  height: 100%;
  border-left: 2px solid black;
}

.room-label {
  padding: 4px;
}

.rooms-ctn {
  flex-basis: 160px;
  border-right: 2px solid lightgray;
  overflow-y: auto;
}

.rooms-ctn > header {
  font-weight: bold;
}
</style>
