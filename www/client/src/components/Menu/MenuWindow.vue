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
      <header class="top-bar">
        <a @click="close_chat">
          <i class="far fa-times-circle top-bar__close"></i>
        </a>
        <div class="top-bar__name">Chat {{ current_room }}</div>
      </header>
      <ChatWindow />
    </div>
  </div>
</template>

<script lang="ts">
import FriendWindow from './FriendWindow.vue'
import ChatWindow from './ChatWindow.vue'

export default {
  components: {
    FriendWindow,
    ChatWindow,
  },
  data() {
    return {
      open: false,
      chat_open: false,
      current_room: '',
    }
  },
  methods: {
    toggle_window() {
      this.open = !this.open
    },
    open_chat(user: any) {
      this.chat_open = true
      this.set_current_room(user.nickname)
    },
    close_chat() {
      this.chat_open = false
    },
    set_current_room(new_name: String) {
      this.current_room = '- ' + new_name
    },
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
  width: 200px;
  position: fixed;
  bottom: 0;
  right: 10px;
  background-color: grey;
}

.window--chat-open {
  width: 800px;
  display: flex;
  flex-direction: row-reverse;
}

.window-friend {
  flex-basis: 200px;
}

.window-chat {
  flex-grow: 1;
  border-right: 2px solid lightgray;
}

.top-bar {
  display: flex;
  justify-content: flex-start;
  padding: 4px 4px;
  background-color: black;
  color: white;
}

.top-bar__name {
  flex-grow: 1;
}

.top-bar__close {
  color: whitesmoke;
  cursor: pointer;
}
</style>
