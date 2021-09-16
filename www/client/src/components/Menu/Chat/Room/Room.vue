<template>
  <div class="room-ctn">
    <div class="content">
      <Setting
        v-if="open_setting"
        @close="open_setting = false"
        @leave="$emit('leave')"
        :Room="room"
      />

      <div v-if="!open_setting" class="messages-ctn">
        <div
          v-for="message in messages"
          :key="message"
          class="msg"
          :class="{ 'msg--from-me': message.author.id == me.id }"
        >
          <p class="msg__name">{{ message.author.name }}</p>
          <span class="msg__content">{{ message.content }}</span>
        </div>
      </div>
    </div>

    <div class="bar">
      <i
        class="fas fa-cogs setting-btn"
        @click="open_setting = !open_setting"
      ></i>
      <div class="bar__input" v-if="!open_setting">
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
import { useSocket } from '@/composables/socket'
import { MessageType } from '@/types/chat/message'
import { useAuth } from '@/composables/auth'

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
  setup(props, { emit }) {
    let open_setting = ref(false)
    let message_field = ref('')
    let me = useAuth().user

    let { room, fetchRoom } = getFetchRoom()

    const { messages, fetchMessages } = getFetchMessages()
    const { createMessage } = getCreateMessage()

    const sendMessage = async () => {
      if (message_field.value.length) {
        await createMessage(props.RoomId!, message_field.value)
        message_field.value = ''
      }
    }

    const getData = async (id: number) => {
      if (id != 0) {
        await fetchRoom(id)
        await fetchMessages(id)
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
      sendMessage,
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
}

.msg__content {
  padding: 3px;
  border-radius: 4px;
  background-color: cadetblue;
  text-align: left;
  max-width: 250px;
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
