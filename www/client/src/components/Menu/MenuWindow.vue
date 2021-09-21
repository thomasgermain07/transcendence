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
      <FriendWindow
        @open_chat="open_chat"
        @close="toggle_window"
        :Notification="notifications.length"
        :ChatStatus="chat_open"
      />
    </div>
    <div v-if="chat_open" class="window-chat">
      <ChatWindow
        @refresh_rooms="refreshRooms"
        @refresh_related_users="refreshRelatedUsers"
        @set_page_title="set_page_title"
        @close="close_chat"
        :DmID="dmID"
        :Notifications="notifications"
        :Rooms="rooms"
        :RelatedUsers="relatedUsers"
        :PageTitle="page_title"
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
    let dmID = ref(0)

    let { rooms, fetchRooms } = getFetchRooms()
    let { relatedUsers, fetchUsers } = getFetchUsers()

    const toggle_window = () => {
      if (open.value == false) {
        if (notification.value) {
          chat_open.value = true
        }
      } else {
        notification.value = false
      }
      open.value = !open.value
    }

    const open_chat = (userID?: number, userName?: string) => {
      if (userID && userName) {
        dmID.value = userID
        set_page_title(userName)
      }
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
    const refreshRelatedUsers = async () => {
      await fetchUsers()
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
      dmID,
      notification,
      notifications,
      rooms,
      relatedUsers,
      refreshRooms,
      refreshRelatedUsers,
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
  bottom: 50px;
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

.chat__top-bar {
  border-right: 2px solid lightgray;
}
</style>
