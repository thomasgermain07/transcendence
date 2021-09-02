<template>
  <a class="open-button" v-if="!open" @click="toggle_window">
    <i class="fas fa-comments fa-2x"></i>
  </a>

  <div v-if="open" class="window" :class="{ 'window--chat-open': chat_open }">
    <div class="window-friend">
      <header class="top-bar">
        <a @click="toggle_window">
          <i class="far fa-times-circle top-bar__close"></i>
        </a>
        <div class="top-bar__name">Friends</div>
      </header>
      <FriendWindow @open_chat="open_chat" />
    </div>
    <div v-if="chat_open" class="window-chat">
      <header class="top-bar chat__top-bar">
        <a @click="close_chat">
          <i class="far fa-times-circle top-bar__close"></i>
        </a>
        <div class="top-bar__name">Chat - {{ page_title }}</div>
      </header>
      <ChatWindow @set_page_title="set_page_title" />
    </div>
  </div>
</template>

<script lang="ts">
import FriendWindow from './FriendWindow.vue'
import ChatWindow from './ChatWindow.vue'
import { ref } from '@vue/reactivity'
import { onMounted } from '@vue/runtime-core'
import getFetchRooms from '@/composables/Chat/Rooms/fetchRooms'
import { useSocket } from '@/composables/socket'
import { RoomType } from '@/types/chat/room'

export default {
  components: {
    FriendWindow,
    ChatWindow,
  },
  setup() {
    let open = ref(false)
    let chat_open = ref(false)
    let page_title = ref('')

    const toggle_window = () => {
      open.value = !open.value
    }
    const open_chat = () => {
      chat_open.value = true
    }
    const close_chat = () => {
      chat_open.value = false
    }
    const set_page_title = (title: string) => {
      page_title.value = title
    }

    onMounted(async () => {
      let { rooms, fetchRooms } = getFetchRooms()

      await fetchRooms(true)

      rooms.value.forEach((room: RoomType) => {
        console.log(`socket.emit(join, ${room.name})`)
        useSocket('chat').socket.emit('join', { room_id: room.id })
      })
    })

    useSocket('chat').socket.on('message', () => {
      console.log('new notification') // TODO : handle notification
    })

    return {
      open,
      chat_open,
      page_title,
      toggle_window,
      open_chat,
      close_chat,
      set_page_title,
    }
  },
}
</script>

<style scoped>
.open-button {
  position: fixed;
  bottom: 0;
  right: 10px;
  margin: 5px;
}

.window {
  width: 180px;
  height: 400px;
  position: fixed;
  bottom: 0px;
  right: 10px;
  background-color: grey;
}

.window--chat-open {
  width: 800px;
  display: flex;
  flex-direction: row-reverse;
}

.window-friend {
  flex-basis: 180px;
}

.window-chat {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  padding: 4px 4px;
  background-color: black;
  color: white;
}

.chat__top-bar {
  border-right: 2px solid lightgray;
}

.top-bar__name {
  flex-grow: 1;
}

.top-bar__close {
  color: whitesmoke;
  cursor: pointer;
}
</style>
