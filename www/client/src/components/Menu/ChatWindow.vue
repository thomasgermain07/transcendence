<template>
  <div class="chat-window">
    <div class="rooms-ctn">
      <header class="room-label">Rooms</header>
      <Rooms @toggle_create_window="toggle_create_window" />
    </div>
    <div class="chat-ctn">
      <CreateRoom v-if="showCreateRoom"></CreateRoom>
    </div>
  </div>
</template>

<script lang="ts">
import Rooms from './Chat/Rooms.vue'
import CreateRoom from './Chat/CreateRoom.vue'
import { ref } from '@vue/reactivity'

export default {
  components: {
    Rooms,
    CreateRoom,
  },
  setup() {
    let showCreateRoom = ref(false)

    const toggle_create_window = () => {
      showCreateRoom.value = !showCreateRoom.value
    }

    return {
      showCreateRoom,
      toggle_create_window,
    }
  },
  emits: ['set_current_room'],
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
