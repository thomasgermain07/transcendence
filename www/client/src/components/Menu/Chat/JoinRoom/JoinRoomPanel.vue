<template>
  <div class="panel-ctn">
    <div class="roll-menu__password">
      <input
        type="password"
        placeholder="password"
        class="field-input"
        v-if="room.password"
        v-model="password_field"
      />
    </div>

    <div class="error-msg">{{ error }}</div>

    <button @click="join">join</button>
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'

import getCreateSubscription from '@/composables/Chat/Subscription/createSubscription'

import { useChat } from '@/composables/Chat/useChat'

export default {
  props: {
    room: Object,
  },
  setup(props, { emit }) {
    let error = ref('')

    const { chatSocket } = useChat()

    let { password_field, createSubscription } = getCreateSubscription()

    const join = () => {
      createSubscription(props.room!.name)
        .then(() => {
          chatSocket.emit('join', { room_id: props.room!.id })
          emit('joinned')
        })
        .catch((e) => {
          error.value = e.response.data.message
        })
    }

    return { error, password_field, join }
  },
}
</script>

<style scoped>
.panel-ctn {
  border-bottom: 1px solid darkgray;
  padding: 10px;
}

.panel-ctn * {
  margin: 3px;
}

.error-msg {
  color: red;
  font-weight: lighter;
}
</style>
