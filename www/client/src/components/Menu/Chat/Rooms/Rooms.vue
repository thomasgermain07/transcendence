<template>
  <v-contextmenu ref="contextmenu">
    <v-contextmenu-item
      v-if="cm_conv.type == 'dm'"
      @click="eventHandler.onProfile(cm_conv.target)"
      >View Profile</v-contextmenu-item
    >
    <v-contextmenu-item
      v-if="cm_conv.type == 'dm'"
      @click="eventHandler.onSendDuel(cm_conv.target)"
      >Send Duel</v-contextmenu-item
    >
    <v-contextmenu-item
      v-if="cm_conv.type == 'dm'"
      @click="eventHandler.onBlockUser(cm_conv.target)"
      >Block</v-contextmenu-item
    >
  </v-contextmenu>

  <div class="convs-interaction-ctn">
    <div class="convs-interaction" @click="$emit('open', 'create')">Create</div>
    <div class="convs-interaction" @click="$emit('open', 'join')">Join</div>
  </div>

  <div v-if="convs" class="convs__list">
    <p v-if="!convs.length">No rooms registered</p>

    <div v-for="conv in convs" :key="conv">
      <div
        class="convs-item"
        @click.left="openConv(conv)"
        @click.right="cm_conv = conv"
        v-contextmenu:contextmenu
      >
        <i v-if="conv.type == 'room'" class="fas fa-users conv-icon"></i>
        <i v-else-if="conv.type == 'dm'" class="fas fa-user conv-icon"></i>

        <span class="convs-item--name">{{ conv.target.name }}</span>
        <i
          class="fas fa-bell notification"
          :class="{ 'notification--visible': conv.notification }"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { ConversationType } from '@/types/chat/conversation'
import { useChat } from '@/composables/Chat/useChat'
import { useContextMenu } from '@/composables/useContextMenu'

export default {
  props: {
    RoomId: Number,
  },
  setup(props, { emit }) {
    let cm_conv = ref<ConversationType>()

    const { convs, readNotif } = useChat()

    const eventHandler = useContextMenu()

    const openConv = (conv: ConversationType) => {
      readNotif(conv.target.id)
      emit('open', conv.type, { id: conv.target.id, name: conv.target.name })
    }

    return {
      openConv,
      cm_conv,
      eventHandler,
      convs,
    }
  },
  emits: ['open'],
}
</script>

<style scoped>
.rooms__banner {
  background-color: darkgray;
  border-bottom: 2px solid black;
  font-weight: bold;
}

.convs-interaction-ctn {
  display: flex;
  background-color: darkgray;
}

.notification {
  color: red;
  visibility: hidden;
}

.notification--visible {
  visibility: visible;
}

.convs-interaction {
  padding: 3px;
  flex-grow: 1;
  border-bottom: 2px solid black;
  cursor: pointer;
}

.convs-interaction:hover {
  background-color: white;
}

.convs-interaction-ctn > .convs-interaction:first-child {
  border-right: 2px solid black;
}

.convs__list {
  display: flex;
  flex-direction: column;
}

.convs-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid darkgray;
  cursor: pointer;
}

.convs-item--name {
  padding: 4px 0;
  overflow: hidden !important;
  text-overflow: ellipsis;
}

/* TODO : Align conv icon on the center */
.conv-icon {
  padding: 2px;
}
</style>
