<template>
  <a
    class="open-btn"
    :class="{ 'open-btn--notif': notification }"
    v-if="!window_open"
    @click="openWindow"
  >
    <i class="fas fa-comments fa-2x"></i>
  </a>

  <div
    v-if="window_open"
    class="window"
    :class="{ 'window--chat-open': chat_open }"
  >
    <div class="window-friend">
      <FriendWindow />
    </div>
    <div v-if="chat_open" class="window-chat">
      <ChatWindow />
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
import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/windowInteraction'

export default {
  components: {
    FriendWindow,
    ChatWindow,
  },
  setup() {
    const { window_open, chat_open, notification, openWindow, closeWindow } =
      useWindowInteraction()

    const { notifications } = useChat()

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
      window_open,
      chat_open,
      notification,
      openWindow,
      closeWindow,
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
