<template>
  <div class="chat-window">
    <div class="rooms-ctn">
      <header class="room-label">Rooms</header>
      <Rooms ref="rooms" @open="open" />
    </div>
    <div class="chat-ctn">
      <Room v-if="openned == 'room'" />
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
import Rooms from './Chat/Rooms.vue'
import CreateRoom from './Chat/CreateRoom.vue'
import JoinRoom from './Chat/JoinRoom.vue'
import Room from './Chat/Room.vue'
import { getRoomsInteraction } from '../../composables/Chat/windowInteraction'
import { ref } from '@vue/reactivity'

export default {
  components: {
    Rooms,
    Room,
    CreateRoom,
    JoinRoom,
  },
  setup(props, { attrs, slots, emit }) {
    let { rooms, refresh_rooms } = getRoomsInteraction()
    let openned = ref('')

    const open_room = (id: number, name: string) => {
      emit('set_page_title', name)
      console.log(`open chat id: ${id} (${name})`)
      // TODO : open Room vue
    }

    const close = () => {
      openned.value = ''
    }

    const open = (vue: string, params?: any) => {
      if (vue == 'room') {
        open_room(params.id, params.name)
        openned.value = vue
      } else if (vue == 'create') {
        openned.value = vue
      } else if (vue == 'join') {
        openned.value = vue
      }
    }

    return {
      rooms,
      openned,
      open,
      close,
      refresh_rooms,
    }
  },
  emit: ['set_page_title'],
}
</script>

<style scoped>
.chat-window {
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

.chat-ctn {
  flex-grow: 1;
}
</style>
