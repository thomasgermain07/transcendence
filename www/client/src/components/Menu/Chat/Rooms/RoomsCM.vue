<template>
  <v-contextmenu-item
    v-if="Conv?.type == 'dm'"
    @click="eventHandler.onProfile(getDmTarget)"
    >View Profile</v-contextmenu-item
  >
  <v-contextmenu-item
    v-if="Conv?.type == 'dm' && !isBlocked(getDmTarget.id)"
    @click="eventHandler.onSendDuel(getDmTarget)"
    >Send Duel</v-contextmenu-item
  >

  <v-contextmenu-item
    v-if="Conv?.type == 'dm' && !isBlocked(getDmTarget.id)"
    @click="eventHandler.onBlockUser(getDmTarget)"
    >Block</v-contextmenu-item
  >
  <v-contextmenu-item
    v-if="Conv?.type == 'dm' && isBlocked(getDmTarget.id)"
    @click="eventHandler.onUnblockUser(getDmTarget)"
    >Unblock</v-contextmenu-item
  >
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@vue/runtime-core'
import { ConversationType } from '@/types/chat/conversation'
import { useContextMenu } from '@/composables/useContextMenu'
import { useFriends } from '@/composables/Friends/useFriends'
import { UserType } from '@/types/user/user'

export default defineComponent({
  props: {
    Conv: Object as PropType<ConversationType>,
  },
  setup(props) {
    const eventHandler = useContextMenu()
    const { isBlocked } = useFriends()

    const getDmTarget = computed(() => {
      return props.Conv?.target as UserType
    })

    return {
      eventHandler,
      isBlocked,
      getDmTarget,
    }
  },
})
</script>
