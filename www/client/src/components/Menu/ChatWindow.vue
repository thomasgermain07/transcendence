<template>
  <div class="chat-window">
    <div class="rooms-ctn">
      <header class="room-label">Rooms</header>
      <Rooms
        ref="rooms"
        @toggle_create_window="toggle_create_window"
        @open_room="open_room"
      />
    </div>
    <div class="chat-ctn">
      <Room />
      <CreateRoom
        v-if="showCreateRoom"
        @toggle_create_window="toggle_create_window"
        @refresh_rooms="refresh_rooms"
      ></CreateRoom>
    </div>
  </div>
</template>

<script lang="ts">
import Rooms from './Chat/Rooms.vue'
import CreateRoom from './Chat/CreateRoom.vue'
import Room from './Chat/Room.vue'
import getWindowInteraction from '../../composables/Chat/windowInteraction'

export default {
  components: {
    Rooms,
    Room,
    CreateRoom,
  },
  setup(props, { attrs, slots, emit }) {
    let { showCreateRoom, rooms, toggle_create_window, refresh_rooms } =
      getWindowInteraction()

    const open_room = (id: number, name: string) => {
      emit('set_page_title', name)
    }

    return {
      rooms,
      showCreateRoom,
      toggle_create_window,
      refresh_rooms,
      open_room,
    }
  },
  emit: ['set_page_title'],
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
