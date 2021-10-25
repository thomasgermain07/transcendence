<template>
  <v-contextmenu ref="contextmenu">
    <RoomsCM :Conv="cm_conv" />
  </v-contextmenu>

  <div class="convs-interaction-ctn">
    <div class="convs-interaction" @click="openCreate">Create</div>
    <div class="convs-interaction" @click="openJoin">Join</div>
  </div>

  <div v-if="convs" class="convs__list">
    <p v-if="!convs.length">No rooms registered</p>

    <div v-for="conv in convs" :key="conv">
      <div
        class="convs-item"
        @click.left="onOpenConv(conv)"
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
import { defineComponent, ref } from 'vue'

import { useChat } from '@/composables/Chat/useChat'
import { useWindowInteraction } from '@/composables/Chat/WindowInteraction/useWindowInteraction'

import { ConversationType } from '@/types/chat/conversation'
import { UserType } from '@/types/user/user'
import { RoomType } from '@/types/chat/room'

import RoomsCM from './RoomsCM.vue'

export default defineComponent({
  props: {
    RoomId: Number,
  },
  components: {
    RoomsCM,
  },
  setup() {
    let cm_conv = ref<ConversationType>()

    const { convs, readNotif } = useChat()
    const { openDm, openRoom, openCreate, openJoin } = useWindowInteraction()

    const onOpenConv = (conv: ConversationType) => {
      readNotif(conv.target.id)

      if (conv.type == 'dm') {
        openDm(conv.target as UserType)
      } else if (conv.type == 'room') {
        openRoom(conv.target as RoomType)
      }
    }

    return {
      onOpenConv,
      openCreate,
      openJoin,
      cm_conv,
      convs,
    }
  },
})
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
