<template>
  <div class="chat-window">
    <div class="rooms-ctn">
      <header class="window-title">
        <p>Rooms</p>
      </header>
      <Rooms ref="rooms" @open="open" />
    </div>
    <div class="chat-ctn">
      <Room v-if="openned == 'room'" :room_id="room" @leave="left_room" />
      <CreateRoom
        v-if="openned == 'create'"
        @close="close"
        @refresh_rooms="refresh_rooms"
      />
      <JoinRoom
        v-if="openned == 'join'"
        @close="close"
        @refresh_rooms="refresh_rooms"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Rooms from './Chat/Rooms/Rooms.vue'
import CreateRoom from './Chat/CreateRoom/CreateRoom.vue'
import JoinRoom from './Chat/JoinRoom/JoinRoom.vue'
import Room from './Chat/Room/Room.vue'
import {
  getChatWindowInteraction,
  getRoomsInteraction,
} from '@/composables/Chat/WindowInteraction/windowInteraction'

export default {
  components: {
    Rooms,
    Room,
    CreateRoom,
    JoinRoom,
  },
  setup(props, { emit }) {
    let { rooms, refresh_rooms } = getRoomsInteraction()

    let { room, openned, open, close } = getChatWindowInteraction(
      (title: String) => {
        emit('set_page_title', title)
      },
    )

    const left_room = () => {
      refresh_rooms()
      emit('set_page_title', '')
    }

    return { rooms, room, openned, open, close, refresh_rooms, left_room }
  },
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-grow: 1;
  border-left: 2px solid black;
}

.window-title {
  border-bottom: 2px solid black;
  background-color: darkgray;
}

.window-title p {
  font-size: x-large;
  font-weight: normal;
  padding: 2px;
}

.rooms-ctn {
  flex-basis: 160px;
  border-right: 2px solid black;
  overflow-y: auto;
}

.rooms-ctn > header {
  font-weight: bold;
}

.chat-ctn {
  flex-grow: 1;
  border-right: 2px solid black;
  display: flex;
}
</style>
