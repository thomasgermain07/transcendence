<template>
  <div class="room-ctn">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="eventHandler.onProfile(cm_user)"
        >View Profile</v-contextmenu-item
      >
      <v-contextmenu-item @click="eventHandler.onSendDuel(cm_user)"
        >Send Duel</v-contextmenu-item
      >
      <v-contextmenu-item @click="eventHandler.onBlockUser(cm_user)"
        >Block</v-contextmenu-item
      >
    </v-contextmenu>

    <div class="content">
      <Setting
        v-if="open_setting"
        @close="open_setting = false"
        @leave="$emit('leave')"
        :Room="room"
      />
      <!-- TODO (CSS) : Check why long messages with no space overflow on x axis -->
      <div class="messages-ctn" v-if="!open_setting">
        <div
          v-for="message in messages"
          :key="message"
          class="msg"
          :class="{ 'msg--from-me': message.author.id == me.id }"
        >
          <p
            v-if="message.author.id != me.id"
            class="msg__name"
            v-contextmenu:contextmenu
            @click.right="cm_user = message.author"
          >
            {{ message.author.name }}
          </p>
          <p v-else class="msg__name">
            {{ message.author.name }}
          </p>
          <span class="msg__content">{{ message.content }}</span>
        </div>
        <a
          v-if="!max_msg && messages.length >= 50"
          class="info info--clickable"
          @click="loadMoreMessages"
        >
          load more</a
        >
        <div v-else-if="messages.length" class="info">no more messages</div>
        <div v-else class="info">No message yet</div>
      </div>
    </div>

    <div class="bar" v-if="!open_setting">
      <i
        class="fas fa-cogs setting-btn"
        @click="open_setting = !open_setting"
      ></i>
      <div class="bar__input">
        <input
          type="text"
          class="input__field"
          v-model="message_field"
          @keypress.enter="sendMessage"
        />
        <div class="input__btn" @click="sendMessage">Send</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref, watch } from 'vue'

import { useAuth } from '@/composables/auth'
import { useContextMenu } from '@/composables/useContextMenu'
import { useSocket } from '@/composables/socket'

import { MessageType } from '@/types/chat/message'
import { UserType } from '@/types/user/user'

import Setting from './Setting.vue'

import getFetchRoom from '@/composables/Chat/Room/fetchRoom'
import getFetchMessages from '@/composables/Chat/Messages/fetchMessages'
import getCreateMessage from '@/composables/Chat/Messages/createMessage'

export default {
  props: {
    RoomId: Number,
  },
  components: {
    Setting,
  },
  setup(props) {
    let open_setting = ref(false)
    let message_field = ref('')
    let me = useAuth().user
    let max_msg = ref(false)
    let page = 1
    let cm_user = ref<UserType>()

    let { room, fetchRoom } = getFetchRoom()

    const { messages, fetchMessages } = getFetchMessages()
    const { createMessage } = getCreateMessage()

    const eventHandler = useContextMenu()

    const loadMoreMessages = async () => {
      page += 1
      let size_before = messages.value.length
      await fetchMessages(props.RoomId!, page)
      if (messages.value.length == size_before) {
        max_msg.value = true
      }
    }

    const sendMessage = async () => {
      if (message_field.value.length) {
        await createMessage(props.RoomId!, message_field.value)
        message_field.value = ''
      }
    }

    const getData = async (id: number) => {
      max_msg.value = false
      page = 1
      messages.value.length = 0
      if (id != 0) {
        await fetchRoom(id)
        await fetchMessages(id, 0)
      }
    }

    onMounted(() => getData(props.RoomId!))

    watch(
      () => props.RoomId,
      (new_value) => {
        getData(new_value!)
        open_setting.value = false
      },
    )

    useSocket('chat').socket.on('message', (message: MessageType) => {
      if (message.room.id == props.RoomId) {
        messages.value!.unshift(message)
      }
    })

    return {
      open_setting,
      message_field,
      me,
      room,
      messages,
      max_msg,
      cm_user,
      eventHandler,
      sendMessage,
      loadMoreMessages,
    }
  },
}
</script>

<style scoped>
.room-ctn {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
}

.content {
  flex-grow: 1;
}

.messages-ctn {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  max-height: 347px;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
}

.msg {
  margin: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.msg--from-me {
  align-self: flex-end;
  align-items: flex-end;
}

.msg__name {
  padding: 4px;
  cursor: default;
}

.msg__content {
  padding: 3px;
  border-radius: 4px;
  background-color: cadetblue;
  text-align: left;
  max-width: 250px;
}

.info {
  align-self: center;
}

.info--clickable {
  cursor: pointer;
}

.bar {
  flex-basis: auto;
  background-color: lightgray;
  border-top: 2px solid black;
  display: flex;
  justify-content: space-between;
}

.bar__input {
  width: 100%;
  display: flex;
}

.input__field {
  width: 80%;
}

.input__btn {
  width: 15%;
  padding: 5px;
  border-left: 2px solid black;
  cursor: pointer;
}

.setting-btn {
  padding: 5px;
  border-right: 2px solid black;
  cursor: pointer;
}
</style>
