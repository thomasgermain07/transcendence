<template>
  <div class="chat-window">
    <TopBar
      class="top-bar"
      :Title="getPageTitle"
      @close="$emit('close')"
      @refresh="loadData"
    />
    <div class="chat-content">
      <div class="rooms-ctn">
        <header class="window-title">
          <p>Rooms</p>
        </header>
        <Rooms @open="open" :RoomId="open_id" />
      </div>
      <div class="chat-ctn">
        <Room v-if="openned == 'room'" :RoomId="open_id" @leave="left_room" />
        <Dm v-if="openned == 'dm'" :UserId="open_id" />
        <CreateRoom v-if="openned == 'create'" @close="close" />
        <JoinRoom v-if="openned == 'join'" @close="close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, watch } from '@vue/runtime-core'

import getChatWindowInteraction from '@/composables/Chat/WindowInteraction/windowInteraction'

import TopBar from './Utils/TopBar.vue'
import Rooms from './Chat/Rooms/Rooms.vue'
import CreateRoom from './Chat/CreateRoom/CreateRoom.vue'
import JoinRoom from './Chat/JoinRoom/JoinRoom.vue'
import Room from './Chat/Room/Room.vue'
import Dm from './Chat/Dm/Dm.vue'
import { useChat } from '@/composables/Chat/useChat'

export default {
  components: {
    TopBar,
    Rooms,
    Room,
    CreateRoom,
    JoinRoom,
    Dm,
  },
  props: {
    PageTitle: String,
    DmID: Number,
  },
  setup(props, { emit }) {
    let { open_id, openned, open, close } = getChatWindowInteraction(
      (title: String) => {
        emit('set_page_title', title)
      },
    )

    const { loadData, reloadRooms } = useChat()

    const getPageTitle = computed(() => {
      return 'Chat - ' + props.PageTitle
    })

    const left_room = () => {
      reloadRooms()
      close()
    }

    const openDm = (id: number) => {
      if (id != 0) {
        open('dm', { id: id })
      }
    }

    onMounted(() => openDm(props.DmID!))

    watch(
      () => props.DmID,
      (new_id) => openDm(new_id!),
    )

    return {
      open_id,
      openned,
      getPageTitle,
      open,
      loadData,
      close,
      left_room,
    }
  },
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.top-bar {
  border-right: 2px solid lightgray;
}

.chat-content {
  display: flex;
  flex-grow: 1;
  border-left: 2px solid black;
  max-height: 375px;
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
