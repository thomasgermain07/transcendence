<template>
  <v-contextmenu-item
    v-if="Conv.type == 'dm'"
    @click="eventHandler.onProfile(Conv.target)"
    >View Profile</v-contextmenu-item
  >
  <v-contextmenu-item
    v-if="Conv.type == 'dm' && !isBlocked(Conv.target.id)"
    @click="eventHandler.onSendDuel(Conv.target)"
    >Send Duel</v-contextmenu-item
  >

  <v-contextmenu-item
    v-if="Conv.type == 'dm' && !isBlocked(Conv.target.id)"
    @click="eventHandler.onBlockUser(Conv.target)"
    >Block</v-contextmenu-item
  >
  <v-contextmenu-item
    v-if="Conv.type == 'dm' && isBlocked(Conv.target.id)"
    @click="eventHandler.onUnblockUser(Conv.target)"
    >Unblock</v-contextmenu-item
  >
</template>

<script lang="ts">
import { PropType } from '@vue/runtime-core'
import { ConversationType } from '@/types/chat/conversation'
import { useContextMenu } from '@/composables/useContextMenu'
import { useFriends } from '@/composables/Friends/useFriends'

export default {
  props: {
    Conv: Object as PropType<ConversationType>,
  },
  setup() {
    const eventHandler = useContextMenu()
    const { isBlocked } = useFriends()

    return {
      eventHandler,
      isBlocked,
    }
  },
}
</script>
