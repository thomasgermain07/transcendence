<template>
  <div class="join-room-ctn">
    <header class="window-bar">
      <i class="fas fa-arrow-left" @click="$emit('close')"></i>
      <p class="window-title">Join room</p>
      <i class="fas fa-arrow-left window-bar__separator"></i>
    </header>

    <div class="rooms-ctn">
      <div
        class="room-ctn"
        v-for="room in rooms"
        :class="{ 'room-ctn--roll-menu-open': open_roll_menu == room.id }"
        :key="room"
      >
        <span
          class="room__name"
          :class="{ 'room__name--no-border': open_roll_menu == room.id }"
          @click="toggle_roll_menu(room.id)"
        >
          {{ room.name }}
          <i v-if="room.password" class="fas fa-lock room__lock"></i>
        </span>

        <JoinRoomPanel
          v-if="open_roll_menu == room.id"
          :room="{ id: room.id, password: room.password }"
          @joinned="joinned"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import requestStatus from '../../../composables/requestStatus'
import fetchRooms from '../../../composables/Chat/Rooms/fetchRooms'
import JoinRoomPanel from './JoinRoomPanel.vue'
import { onMounted, ref } from 'vue'

export default {
  components: {
    JoinRoomPanel,
  },
  emits: ['close', 'refresh_rooms'],
  setup(props, { emit }) {
    let status = ref(requestStatus.default)

    let { rooms, getRooms } = fetchRooms(status)

    onMounted(() => getRooms(false))

    let open_roll_menu = ref(0)
    const toggle_roll_menu = (room_id: number) => {
      if (room_id == open_roll_menu.value) {
        open_roll_menu.value = 0
      } else {
        open_roll_menu.value = room_id
      }
    }

    const joinned = () => {
      emit('refresh_rooms')
      emit('close')
    }

    return {
      rooms,
      getRooms,
      open_roll_menu,
      toggle_roll_menu,
      joinned,
    }
  },
}
</script>

<style scoped>
.join-room-ctn {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}

.window-bar {
  display: flex;
  justify-content: space-between;
}

.window-bar__separator {
  visibility: hidden;
}

.window-title {
  align-self: center;
  font-weight: bold;
  font-size: x-large;
}

.window-bar > i {
  padding: 5px;
  font-size: large;
  cursor: pointer;
}

.room-ctn {
  padding: 5px;
}

.room-ctn--roll-menu-open > * {
  font-weight: bold;
}

.room__name {
  padding: 0 8px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.room__name--no-border {
  border-bottom: 0;
}

.room__name:hover {
  border-radius: 5px;
  background-color: lightgray;
}

.room__lock {
  font-size: 0.7em;
}
</style>
