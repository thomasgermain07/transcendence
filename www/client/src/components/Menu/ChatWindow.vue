<template>
  <div class="chat-window">
    <TopBar
      class="top-bar"
      :Title="getPageTitle"
      @close="closeChat"
      @refresh="onRefreshData"
    />
    <div class="chat-content">
      <div class="rooms-ctn">
        <header class="window-title">
          <p>Rooms</p>
        </header>
        <Rooms :RoomId="conv_id" />
      </div>
      <div class="chat-ctn">
        <Room
          v-if="chat_view == 'room'"
          :RoomId="conv_id"
          @leave="left_room"
          @close="closeChatView"
        />
        <Dm v-if="chat_view == 'dm'" :UserId="conv_id" />
        <CreateRoom v-if="chat_view == 'create'" @close="closeChatView" />
        <JoinRoom v-if="chat_view == 'join'" @close="closeChatView" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from '@vue/runtime-core'

import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/useWindowInteraction'

import TopBar from './Utils/TopBar.vue'
import Rooms from './Chat/Rooms/Rooms.vue'
import CreateRoom from './Chat/CreateRoom/CreateRoom.vue'
import JoinRoom from './Chat/JoinRoom/JoinRoom.vue'
import Room from './Chat/Room/Room.vue'
import Dm from './Chat/Dm/Dm.vue'
import { useChat } from '@/composables/Chat/useChat'
import { useRoom } from '@/composables/Chat/Room/useRoom'

export default defineComponent({
  components: {
    TopBar,
    Rooms,
    Room,
    CreateRoom,
    JoinRoom,
    Dm,
  },
  setup() {
    let { conv_id, chat_view, page_title, closeChat, closeChatView } =
      useWindowInteraction()

    const { reloadRooms } = useChat()
    const { reloadRoom } = useRoom()

    const getPageTitle = computed(() => {
      return 'Chat - ' + page_title.value
    })

    const left_room = () => {
      reloadRooms()
      closeChatView()
    }

    const onRefreshData = async () => {
      await reloadRooms()
      await reloadRoom()
    }

    return {
      conv_id,
      chat_view,
      getPageTitle,
      closeChat,
      closeChatView,
      onRefreshData,
      left_room,
    }
  },
})
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
