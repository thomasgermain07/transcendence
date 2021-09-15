<template>
  <div class="room-ctn">
    <div class="content">
      <div class="messages-ctn">
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
import { ref } from '@vue/reactivity'
import getFetchMessages from '@/composables/Chat/Dms/fetchMessages'
import { onMounted, watch } from '@vue/runtime-core'
import { useAuth } from '@/composables/auth'
import getCreateMessage from '@/composables/Chat/Dms/createMessage'
import { useSocket } from '@/composables/socket'
import { DirectMessageType } from '@/types/chat/direct_message'

export default {
  props: {
    UserId: Number,
  },
  setup(props) {
    let message_field = ref('')
    let { messages, fetchMessages } = getFetchMessages()
    let { createMessage } = getCreateMessage()

    let me = useAuth().user

    const getData = async () => {
      if (props.UserId! != 0) {
        await fetchMessages(props.UserId!)
      }
    }

    onMounted(() => getData())

    watch(
      () => props.UserId,
      () => getData(),
    )

    const sendMessage = async () => {
      if (message_field.value.length) {
        await createMessage(props.UserId!, message_field.value)
        message_field.value = ''
      }
    }

    useSocket('dm').socket.on('message', (message: DirectMessageType) => {
      console.log('new dm')
      if (message.author.id == props.UserId || message.author.id == me.id) {
        messages.value.unshift(message)
      }
    })

    return {
      me,
      message_field,
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
