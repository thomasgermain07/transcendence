<template>
  <div class="rooms-ctn">
    <div class="room" v-for="room in rooms" :key="room">
      <span
        class="room__name"
        :class="{ 'room__name--panel-open': open_panel == room.id }"
        @click="openPanel(room.id)"
      >
        {{ room.name }}
        <i v-if="room.password" class="fas fa-lock room__lock"></i>
      </span>
      <JoinRoomPanel
        v-if="open_panel == room.id"
        :room="room"
        @subCreate="$emit('joinned')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import JoinRoomPanel from './JoinRoomPanel.vue'
import requestStatus from '@/composables/requestStatus'
import getFetchRooms from '@/composables/Chat/Rooms/fetchRooms'
import getJoinPanelInteraction from '@/composables/Chat/WindowInteraction/getJoinPanelInteraction'

export default {
  components: {
    JoinRoomPanel,
  },
  setup() {
    let status = ref(requestStatus.loading)
    let { rooms, fetchRooms } = getFetchRooms(status)

    let { open_panel, openPanel } = getJoinPanelInteraction()

    onMounted(() => fetchRooms(false))

    return { rooms, open_panel, openPanel }
  },
}
</script>

<style scoped>
.rooms-ctn {
  overflow-y: auto;
}

.room {
  padding: 5px;
}

.room__name {
  padding: 0 8px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.room__name--panel-open {
  border-bottom: 0;
  font-weight: bold;
}

.room__name:hover {
  border-radius: 5px;
  background-color: lightgray;
}

.room__lock {
  font-size: 0.7em;
}
</style>
