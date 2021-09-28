<template>
  <div class="friend-container">
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="eventHandler.onProfile(cm_user)"
        >View Profile</v-contextmenu-item
      >
      <v-contextmenu-item @click="onOpenDm">Send Message</v-contextmenu-item>
      <v-contextmenu-item @click="eventHandler.onSendDuel(cm_user)"
        >Send Duel</v-contextmenu-item
      >
      <v-contextmenu-item @click="eventHandler.onDeleteFriend(cm_user)"
        >Delete Friend</v-contextmenu-item
      >
      <v-contextmenu-item @click="eventHandler.onBlockUser(cm_user)"
        >Block</v-contextmenu-item
      >
    </v-contextmenu>

    <div
      class="friend-item"
      v-for="friend in Friends"
      :key="friend"
      @click.left="$emit('open_chat', friend.id, friend.name)"
      @click.right="onRightClick(friend)"
      v-contextmenu:contextmenu
    >
      {{ friend.name }}
      <!-- TODO : connected for status connection -->
      <i
        class="fas fa-circle status"
        :class="friend.connected ? 'status--connected' : 'status--disconnected'"
      ></i>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, ref } from 'vue'

import { UserType } from '@/types/user/user'

import { useContextMenu } from '@/composables/useContextMenu'

export default {
  props: {
    Friends: Array as PropType<Array<UserType>>,
  },
  setup(props, { emit }) {
    let cm_user = ref<UserType>()

    const eventHandler = useContextMenu()

    const onRightClick = (user: UserType) => {
      cm_user.value = user
    }

    const onOpenDm = () => {
      if (cm_user == undefined) {
        return
      }
      emit('open_chat', cm_user.value!.id, cm_user.value!.name)
    }

    return {
      cm_user,
      onOpenDm,
      onRightClick,
      eventHandler,
    }
  },
}
</script>

<style scoped>
.friend-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.friend-item {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  padding: 6px;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.status {
  font-size: 0.7em;
  align-self: center;
}

.status--connected {
  color: green;
}

.status--disconnected {
  color: red;
}
</style>
