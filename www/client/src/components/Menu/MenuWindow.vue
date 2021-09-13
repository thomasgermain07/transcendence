<template>
  <a
    class="open-btn"
    :class="{ 'open-btn--notif': notification }"
    v-if="!open"
    @click="toggle_window"
  >
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
      <ChatWindow
        @set_page_title="set_page_title"
        @refresh_rooms="refreshRooms"
        :Notifications="notifications"
        :Rooms="rooms"
        :RelatedUsers="relatedUsers"
      />
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
import { NotificationType } from '@/types/chat/notification'
import getFetchUsers from '@/composables/Chat/Dms/fetchUsers'
import { useAuth } from '@/composables/auth'
import { MessageType } from '@/types/chat/message'

export default {
  components: {
    FriendWindow,
    ChatWindow,
  },
  setup() {
    let open = ref(false)
    let chat_open = ref(false)
    let page_title = ref('')
    let notification = ref(false)
    let notifications = ref<NotificationType[]>([])
    let currentID = useAuth().user.id

    let { rooms, fetchRooms } = getFetchRooms()
    let { relatedUsers, fetchUsers } = getFetchUsers()

    const toggle_window = () => {
      open.value = !open.value
      if (notification.value) {
        chat_open.value = true
      }
      notification.value = false
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

    const refreshRooms = async () => {
      await fetchRooms(true)
    }

    onMounted(async () => {
      await fetchRooms(true)
      await fetchUsers()

      const socket = useSocket('chat').socket
      rooms.value!.forEach((room: RoomType) => {
        socket.emit('join', { room_id: room.id })
      })

      useSocket('dm').socket.emit('join')
    })

    useSocket('chat').socket.on('message', (message: MessageType) => {
      if (message.author.id != currentID) {
        console.log(`new msg from ${message.author.id}`)
        notifications.value.unshift({ type: 'room', target: message.room.id })
        notification.value = true
      }
    })

    useSocket('dm').socket.on('message', (message: MessageType) => {
      if (message.author.id != currentID) {
        notifications.value.unshift({ type: 'dm', target: message.author.id })
        notification.value = true
      }
    })

    return {
      open,
      chat_open,
      page_title,
      notification,
      notifications,
      rooms,
      relatedUsers,
      refreshRooms,
      toggle_window,
      open_chat,
      close_chat,
      set_page_title,
    }
  },
}
</script>

<style scoped>
.open-btn {
  position: fixed;
  bottom: 0;
  right: 10px;
  margin: 5px;
}

.open-btn--notif i {
  color: red;
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
