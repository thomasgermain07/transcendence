<template>
  <div class="join-room-ctn">
    <header class="window-bar">
      <i class="fas fa-arrow-left" @click="$emit('close')"></i>
      <p class="window-title">Join room</p>
      <i class="fas fa-arrow-left window-bar__separator"></i>
    </header>

    <RoomsList @joinned="joinned" />
  </div>
</template>

<script lang="ts">
import JoinRoomPanel from './JoinRoomPanel.vue'
import RoomsList from './RoomsList.vue'

export default {
  components: {
    JoinRoomPanel,
    RoomsList,
  },
  setup(props, { emit }) {
    const joinned = () => {
      emit('refresh_rooms')
      emit('close')
    }

    return { joinned }
  },
}
</script>

<style scoped>
.join-room-ctn {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.window-bar {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid black;
  background-color: darkgray;
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
</style>
