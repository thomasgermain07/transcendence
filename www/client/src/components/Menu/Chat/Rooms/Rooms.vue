<template>
  <v-contextmenu ref="contextmenu">
    <v-contextmenu-item v-if="cm_conv.type == 'dm'" @click="onProfile"
      >View Profile</v-contextmenu-item
    >
    <v-contextmenu-item v-if="cm_conv.type == 'dm'" @click="onSendDuel"
      >Send Duel</v-contextmenu-item
    >
    <v-contextmenu-item v-if="cm_conv.type == 'dm'" @click="onDeleteFriend"
      >Delete Friend</v-contextmenu-item
    >
    <v-contextmenu-item v-if="cm_conv.type == 'dm'" @click="onBlockUser"
      >Block</v-contextmenu-item
    >
  </v-contextmenu>

  <div class="convs-interaction-ctn">
    <div class="convs-interaction" @click="$emit('open', 'create')">Create</div>
    <div class="convs-interaction" @click="$emit('open', 'join')">Join</div>
  </div>

  <div v-if="sortedConvs" class="convs__list">
    <p v-if="!sortedConvs.length">No rooms registered</p>

    <div v-for="conv in sortedConvs" :key="conv">
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
import { computed, onMounted, ref, watch } from 'vue'
import { ConversationType } from '@/types/chat/conversation'
import { useChat } from '@/composables/Chat/useChat'

export default {
  props: {
    RoomId: Number,
  },
  setup(props, { emit }) {
    let convs = ref<ConversationType[]>([])
    let cm_conv = ref<ConversationType>()

    const { rooms, relatedUsers, notifications, reloadRelatedUsers, getConvs } =
      useChat()

    const markNotification = () => {
      notifications.value.forEach((notif) => {
        let conv = convs.value.find(
          (conv) => conv.type == notif.type && conv.target.id == notif.target,
        )
        if (conv != undefined) {
          if (notif.type == 'room' && conv.type == 'room') {
            conv.target.id != props.RoomId ? (conv.notification = true) : 0
          } else if (notif.type == 'dm' && conv.type == 'dm') {
            conv.target.id != props.RoomId ? (conv.notification = true) : 0
          }
        } else {
          reloadRelatedUsers()
          return
        }
      })
    }

    onMounted(() => {
      convs.value = getConvs()
      markNotification()
    })

    const openConv = (conv: ConversationType) => {
      let index = notifications.value.findIndex(
        (notif) => notif.type == conv.type && notif.target == conv.target.id,
      )
      if (index != undefined && index != -1) {
        notifications.value.splice(index, 1)
      }
      emit('open', conv.type, { id: conv.target.id, name: conv.target.name })
    }

    const sortedConvs = computed(() => {
      convs.value.sort((a, b) => {
        if (a.notification && !b.notification) {
          return -1
        } else if (!a.notification && b.notification) {
          return 1
        }
        return 0
      })
      return convs.value
    })

    watch(
      () => rooms.value.length,
      () => {
        convs.value = getConvs()
        markNotification()
      },
    )
    watch(
      () => relatedUsers.value.length,
      () => {
        convs.value = getConvs()
        markNotification()
      },
    )

    watch(
      () => notifications.value.length,
      () => {
        convs.value.forEach((conv) => {
          conv.notification = false
        })
        markNotification()
      },
    )

    // TODO : module this in useContextMenu
    const onProfile = () => {}
    const onSendDuel = () => {}
    const onDeleteFriend = () => {}
    const onBlockUser = () => {}

    return {
      sortedConvs,
      openConv,
      cm_conv,
      onProfile,
      onSendDuel,
      onDeleteFriend,
      onBlockUser,
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
