<template>
  <v-contextmenu-item @click="eventHandler.onProfile(User)"
    >View Profile</v-contextmenu-item
  >
  <v-contextmenu-item @click="eventHandler.onOpenDm(User)"
    >Send Message</v-contextmenu-item
  >
  <v-contextmenu-item @click="eventHandler.onSendDuel(User)"
    >Send Duel</v-contextmenu-item
  >
  <v-contextmenu-item @click="eventHandler.onDeleteFriend(User)"
    >Delete Friend</v-contextmenu-item
  >
  <v-contextmenu-item @click="eventHandler.onBlockUser(User)"
    >Block</v-contextmenu-item
  >
</template>

<script lang="ts">
import { defineComponent, PropType } from '@vue/runtime-core'

import { useContextMenu } from '@/composables/useContextMenu'

import { UserType } from '@/types/user/user'

export default defineComponent({
  props: {
    User: Object as PropType<UserType>,
  },
  setup() {
    const eventHandler = useContextMenu()

    return {
      eventHandler,
    }
  },
})
</script>
