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
        :ChatStatus="chat_open"
      />
    </div>
    <div v-if="chat_open" class="window-chat">
      <ChatWindow
        @set_page_title="set_page_title"
        @close="close_chat"
        :DmID="dmID"
        :PageTitle="page_title"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue'

import FriendWindow from './FriendWindow.vue'
import ChatWindow from './ChatWindow.vue'

import { InvitationType } from '@/types/game/invitation'

import { useSocket } from '@/composables/socket'
import { useGameInvite } from '@/composables/Game/useGameInvite'
import { useChat } from '@/composables/Chat/useChat'
import { useFriends } from '@/composables/Friends/useFriends'

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
    let dmID = ref(0)

    const { notifications } = useChat()

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

    onMounted(async () => {
      await useChat().loadData()
      await useFriends().loadData()
      useChat().joinSocket()
      useChat().listenSocket()
      useFriends().joinSocket()
      useFriends().listenSocket()
    })

    useSocket('dm').socket.on(
      'gameInvitationReceived',
      (invitation: InvitationType) => {
        useGameInvite().createInvitationNotification(invitation)
      },
    )

    watch(
      () => notifications.value.length,
      (now, before) => {
        if (now > before) {
          notification.value = true
        }
      },
    )

    return {
      open,
      chat_open,
      page_title,
      dmID,
      notification,
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

.chat__top-bar {
  border-right: 2px solid lightgray;
}
</style>
